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

### ✅ ALWAYS DO THIS
\`\`\`typescript
// Use dynamic imports with build-time guards
const isBuildTime = typeof window === 'undefined' && 
  (process.env.NODE_ENV === 'production' && !process.env.VERCEL) ||
  process.env.CI === 'true'

if (!isBuildTime) {
  const { db } = await import('@/firebase')
  const { collection, getDocs } = await import('firebase/firestore')
}
\`\`\`

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
