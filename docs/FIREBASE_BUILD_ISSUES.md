# Firebase Build-Time Issues in Next.js

## The Problem

Next.js performs static analysis during build time, which can cause Firebase imports to be evaluated even when we don't want them to be. This leads to authentication errors during the "Collecting page data" phase.

## Root Causes

1. **Static Analysis**: Next.js analyzes all routes and dependencies during build
2. **Module Imports**: `import` statements are evaluated during webpack bundling
3. **Environment Variables**: Build environment may not have Firebase credentials
4. **Bundling**: Firebase code gets included in server bundles unintentionally

## Prevention Patterns

### ❌ NEVER DO THIS
\`\`\`typescript
// Direct imports cause build-time evaluation
import { db } from '@/firebase'
import { collection, getDocs } from 'firebase/firestore'
\`\`\`

### ❌ PROBLEMATIC PATTERN (Blocks Production Requests)
\`\`\`typescript
// This blocks legitimate requests in Vercel production environments
const isBuildTime = typeof window === 'undefined' && 
  (process.env.NODE_ENV === 'production' && !process.env.VERCEL) ||
  process.env.CI === 'true'  // ❌ This blocks legitimate requests
\`\`\`

### ✅ RECOMMENDED PATTERN (Currently Implemented)
\`\`\`typescript
// Use dynamic imports with proper build-time guards
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

if (!isBuildTime) {
  const { db } = await import('@/firebase')
  const { collection, getDocs } = await import('firebase/firestore')
}
\`\`\`

**Status**: This pattern is consistently implemented across the codebase in:
- `firebase.tsx` - Client-side Firebase initialization
- `lib/firebase-admin.ts` - Admin SDK initialization
- `lib/firebase-global-guard.ts` - Centralized guard functions
- `lib/firebase-trainer.ts` - Trainer service
- `actions/waitlist-actions.ts` - Server actions
- `actions/status-management.ts` - Status management
- Most API routes (see exceptions below)

## Current Status: Identified Issue

⚠️ **ISSUE FOUND**: The Stripe webhook endpoint (`app/api/payments/stripe-webhook/route.ts`) is **missing build-time guards**. 

The `getFirebaseDb()` function in this file is called without checking `isBuildTime()`, which can cause:
- 503 errors on Stripe webhook endpoints during build or if build-time detection fails
- Trainer status updates not processing after successful payments (webhook fails)

**Root Cause**: The webhook route uses Firebase Admin SDK but doesn't check `isBuildTime()` before calling `getFirebaseDb()`. Other payment routes (e.g., `payment-success/route.ts`) correctly use `isBuildTime()` guards.

**Recommended Fix**: Add build-time guard to `app/api/payments/stripe-webhook/route.ts`:
\`\`\`typescript
import { isBuildTime } from "@/lib/firebase-global-guard"

export async function POST(request: NextRequest) {
  if (isBuildTime()) {
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 })
  }
  // ... rest of handler
}
\`\`\`

## Important Notes

- **Never use `process.env.CI === 'true'`** - This blocks legitimate requests in Vercel production environments where CI is always true
- **Use `process.env.NEXT_PHASE === "phase-production-build"`** - This only blocks during actual Next.js build phases
- **Webhook endpoints are particularly sensitive** - All webhook endpoints must have build-time guards to prevent 503 errors for external services like Stripe

## Implementation Status (Last Verified)

✅ **Correctly Implemented**:
- `firebase.tsx` - Uses `process.env.NEXT_PHASE === "phase-production-build"`
- `lib/firebase-admin.ts` - Uses build-time guard
- `lib/firebase-global-guard.ts` - Centralized `isBuildTime()` function
- `lib/firebase-trainer.ts` - Uses build-time guard
- `lib/firebase-safe.ts` - Uses build-time guard
- `app/api/firebase-config.ts` - Uses build-time guard
- `actions/waitlist-actions.ts` - Uses build-time guard with dynamic imports
- `actions/status-management.ts` - Uses build-time guard with dynamic imports
- `app/api/payments/payment-success/route.ts` - Uses `isBuildTime()` from global guard
- `app/api/payments/create-payment-intent/route.ts` - Uses build-time guard
- Most admin API routes - Use `isBuildTime()` from global guard

❌ **Needs Fix**:
- `app/api/payments/stripe-webhook/route.ts` - Missing build-time guard (causes 503 errors)

## File Patterns to Avoid

- Debug/test files with direct Firebase imports
- API routes with module-level Firebase imports
- Server actions without proper build-time guards
- Global Firebase initialization in layout files

## Solution Checklist

- [x] All Firebase imports are dynamic (verified across codebase)
- [x] Build-time detection in all Firebase files (implemented in core files)
- [x] No debug/test files with Firebase imports (verified)
- [x] Environment variables properly configured
- [x] Server actions use conditional imports (verified in `waitlist-actions.ts` and `status-management.ts`)
- [ ] **TODO**: Add build-time guard to `app/api/payments/stripe-webhook/route.ts` to fix 503 errors
