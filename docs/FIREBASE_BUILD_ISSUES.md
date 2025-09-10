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

### ✅ RECOMMENDED PATTERN (Still Under Investigation)
\`\`\`typescript
// Use dynamic imports with proper build-time guards
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build"

if (!isBuildTime) {
  const { db } = await import('@/firebase')
  const { collection, getDocs } = await import('firebase/firestore')
}
\`\`\`

## Current Status: Ongoing Issues

⚠️ **UNRESOLVED**: Despite implementing the recommended patterns above, we are still experiencing:
- 503 errors on Stripe webhook endpoints
- Trainer status updates not processing after successful payments
- Build-time detection may still be incorrectly triggering in production

**Investigation needed**: The root cause of webhook failures remains unidentified.

## Important Notes

- **Never use `process.env.CI === 'true'`** - This blocks legitimate requests in Vercel production environments where CI is always true
- **Use `process.env.NEXT_PHASE === "phase-production-build"`** - This only blocks during actual Next.js build phases, but may still have issues
- **Webhook endpoints are particularly sensitive** - Incorrect build-time detection can cause 503 errors for external services like Stripe

## File Patterns to Avoid

- Debug/test files with direct Firebase imports
- API routes with module-level Firebase imports
- Server actions without proper build-time guards
- Global Firebase initialization in layout files

## Solution Checklist

- [ ] All Firebase imports are dynamic
- [ ] Build-time detection in all Firebase files
- [ ] No debug/test files with Firebase imports
- [ ] Environment variables properly configured
- [ ] Server actions use conditional imports
- [ ] **TODO**: Resolve ongoing 503 webhook errors and trainer activation failures
