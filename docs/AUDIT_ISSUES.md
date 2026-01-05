# Code Audit Issues

This document tracks issues found during code audits, particularly related to Firebase build-time guards and other critical patterns.

**Last Updated**: 2024

---

## Issue #1: Stripe Webhook Route Missing Build-Time Guards

### Summary

The Stripe webhook route (`app/api/payments/stripe-webhook/route.ts`) is missing build-time guards, causing Firebase initialization during Next.js build process. This results in 503 errors on webhook endpoints and prevents trainer status updates from processing after successful payments.

### Context

#### Firebase Build-Time Issues

Next.js performs static analysis during build time, which can cause Firebase imports to be evaluated even when they shouldn't be. This leads to authentication errors during the "Collecting page data" phase.

**Key Principle**: All Firebase operations must be guarded against build-time execution using `process.env.NEXT_PHASE === "phase-production-build"`.

For detailed information, see: [`docs/FIREBASE_BUILD_ISSUES.md`](./FIREBASE_BUILD_ISSUES.md)

#### Current Implementation Pattern

The codebase has established a pattern for handling build-time guards:

1. **Centralized Guard Function**: `lib/firebase-global-guard.ts` exports `isBuildTime()` function
2. **Route-Level Guards**: API routes check `isBuildTime()` at the start of handlers
3. **Function-Level Guards**: Helper functions check `isBuildTime()` before Firebase operations

**Example from `app/api/payments/payment-success/route.ts`** (✅ Correctly implemented):
```typescript
import { isBuildTime } from "@/lib/firebase-global-guard"

export async function GET(request: NextRequest) {
  if (isBuildTime()) {
    console.log("Build time detected - completely skipping payment-success route")
    return new Response("Build time - route disabled", { status: 503 })
  }
  // ... rest of handler
}
```

### The Problem

#### Missing Build-Time Guard

The Stripe webhook route (`app/api/payments/stripe-webhook/route.ts`) calls `getFirebaseDb()` without checking if it's build time:

```typescript
// ❌ CURRENT CODE (Lines 22-39)
async function getFirebaseDb() {
  if (!db) {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")
    // ... initialization code
  }
  return db
}

export async function POST(request: NextRequest) {
  // ❌ No build-time check here!
  const firebaseDb = await getFirebaseDb()  // Called without guard
  // ... rest of handler
}
```

#### Impact

1. **503 Errors on Stripe Webhook Endpoints**
   - During Next.js build process, Firebase initialization fails
   - Webhook requests return 503 errors
   - Stripe retries webhooks, but they continue to fail during build

2. **Trainer Status Updates Not Processing**
   - When a trainer completes payment, Stripe sends webhook to `/api/payments/stripe-webhook`
   - Webhook fails due to Firebase initialization error
   - Trainer status remains inactive despite successful payment
   - Payment is processed, but trainer account is not activated

3. **User Subscription Activation Fails**
   - Similar issue affects user subscription activation
   - `checkout.session.completed` events fail to update user records
   - Users pay but don't get premium access

### Root Cause Analysis

The webhook route has:
- ✅ Dynamic imports (good)
- ✅ Lazy initialization pattern (good)
- ❌ **Missing build-time guard** (critical issue)

The `getFirebaseDb()` function and the `POST` handler both lack checks for `isBuildTime()`. When Next.js builds the application, it may evaluate this route, causing Firebase to attempt initialization without proper credentials.

### Recommended Solution

#### Step 1: Import the Build-Time Guard

Add the import at the top of the file:

```typescript
import { isBuildTime } from "@/lib/firebase-global-guard"
```

#### Step 2: Add Guard to Route Handler

Add build-time check at the start of the `POST` handler:

```typescript
export async function POST(request: NextRequest) {
  // ✅ Add this check
  if (isBuildTime()) {
    console.log("Build time detected - skipping Stripe webhook processing")
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    )
  }

  const debugId = Math.random().toString(36).slice(2, 10)
  // ... rest of existing code
}
```

#### Step 3: Add Guard to getFirebaseDb Function

Add build-time check in the `getFirebaseDb()` function:

```typescript
async function getFirebaseDb() {
  // ✅ Add this check
  if (isBuildTime()) {
    throw new Error("Firebase not available during build time")
  }

  if (!db) {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")
    // ... rest of existing initialization code
  }
  return db
}
```

#### Complete Fixed Code Example

```typescript
/**
 * CRITICAL: Read docs/FIREBASE_BUILD_ISSUES.md before modifying this file!
 * This file contains Firebase Admin SDK usage that MUST be properly guarded against build-time initialization.
 */

import { type NextRequest, NextResponse } from "next/server"
import { isBuildTime } from "@/lib/firebase-global-guard"  // ✅ Added import

let stripe: any = null

async function getStripe() {
  if (!stripe) {
    const Stripe = (await import("stripe")).default
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2024-06-20",
    })
  }
  return stripe
}

let db: any = null

async function getFirebaseDb() {
  // ✅ Added build-time guard
  if (isBuildTime()) {
    throw new Error("Firebase not available during build time")
  }

  if (!db) {
    const { initializeApp, getApps, cert } = await import("firebase-admin/app")
    const { getFirestore } = await import("firebase-admin/firestore")

    if (!getApps().length) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      })
    }
    db = getFirestore()
  }
  return db
}

export async function POST(request: NextRequest) {
  // ✅ Added build-time guard
  if (isBuildTime()) {
    console.log("Build time detected - skipping Stripe webhook processing")
    return NextResponse.json(
      { error: "Service temporarily unavailable" },
      { status: 503 }
    )
  }

  const debugId = Math.random().toString(36).slice(2, 10)
  // ... rest of existing handler code
}
```

### Testing

After implementing the fix:

1. **Build Test**: Verify the application builds without Firebase errors
   ```bash
   npm run build
   ```

2. **Webhook Test**: Send a test webhook from Stripe dashboard
   - Should return 200 OK (not 503) in production
   - Should process trainer/user activation correctly

3. **Payment Flow Test**: Complete a test payment
   - Verify trainer status updates to "active" after payment
   - Verify user subscription is activated after payment

### Related Files

- **Issue File**: `app/api/payments/stripe-webhook/route.ts`
- **Reference Implementation**: `app/api/payments/payment-success/route.ts` (correctly implemented)
- **Guard Utility**: `lib/firebase-global-guard.ts`
- **Documentation**: `docs/FIREBASE_BUILD_ISSUES.md`

### Priority

**HIGH** - This issue directly impacts:
- Payment processing reliability
- Trainer onboarding flow
- User subscription activation
- Customer experience

### Status

🔴 **OPEN** - Awaiting implementation

---

## Issue #2: Missing TypeScript Type for `download_intent` Event

### Summary

The event `download_intent` is actively used in the codebase (`components/download-hero-section.tsx`) but is not included in the `AnalyticsEvent` TypeScript type definition in `lib/analytics.ts`. This creates a type safety issue where TypeScript cannot catch typos or invalid event names at compile time.

### Context

#### Type-Safe Event Tracking Pattern

The codebase uses TypeScript to ensure type safety for analytics events. All valid events are defined in a union type:

```typescript
// lib/analytics.ts
export type AnalyticsEvent =
  | "page_view"
  | "sign_up"
  | "download_app"
  // ... other events
```

The `trackEvent` function accepts only events from this type:

```typescript
export const trackEvent = (event: AnalyticsEvent, parameters: AnalyticsEventParams = {}): void => {
  // ... implementation
}
```

#### Current Usage

The `download_intent` event is used in `components/download-hero-section.tsx`:

```typescript
// ✅ Event is used here
trackEvent("download_intent", {
  platform: "ios",
  location: "hero-section",
})
```

However, `"download_intent"` is not in the `AnalyticsEvent` type, so TypeScript will show an error (or the code might be using `as any` to bypass it).

### The Problem

#### Type Safety Violation

1. **Compile-Time Errors**: TypeScript will flag `"download_intent"` as an invalid event name
2. **No Autocomplete**: IDEs won't suggest `download_intent` when typing event names
3. **Runtime Risk**: If the event name is mistyped elsewhere, it won't be caught until runtime
4. **Inconsistent Pattern**: Other similar events like `download_app` and `app_store_click` are properly typed

#### Impact

- **Developer Experience**: TypeScript errors or need for type assertions
- **Maintainability**: Event name typos won't be caught at compile time
- **Code Quality**: Breaks the established type-safe pattern for analytics

### Root Cause Analysis

The event was likely added to the codebase without updating the TypeScript type definition. This is a common oversight when adding new tracking events.

### Recommended Solution

#### Step 1: Add Event to Type Definition

Update `lib/analytics.ts` to include `download_intent` in the `AnalyticsEvent` type:

```typescript
// lib/analytics.ts (around line 10-42)

export type AnalyticsEvent =
  | "page_view"
  | "sign_up"
  | "purchase"
  | "download_app"
  | "download_intent"  // ✅ Add this line
  | "join_waitlist"
  | "contact_trainer"
  | "view_pricing"
  | "start_workout"
  | "complete_workout"
  | "app_store_click"
  // ... rest of events
```

#### Complete Fixed Code Example

```typescript
// lib/analytics.ts

export type AnalyticsEvent =
  | "page_view"
  | "sign_up"
  | "purchase"
  | "download_app"
  | "download_intent"  // ✅ Added
  | "join_waitlist"
  | "contact_trainer"
  | "view_pricing"
  | "start_workout"
  | "complete_workout"
  | "app_store_click"
  | "form_start"
  | "form_step_complete"
  | "form_field_focus"
  | "form_field_blur"
  | "form_validation_error"
  | "form_abandon"
  | "form_submit_attempt"
  | "form_submit_success"
  | "form_submit_error"
  | "scroll_depth"
  | "cta_click"
  | "nav_click"
  | "waitlist_submit"
  | "get_early_access_click"
  | "talk_to_founders_click"
  | "early_access_valid_form_submission"
  | "login_button_clicked"
  | "login_button"
  | "signup_button"
  | "play_around_button"
  | "tab_click"
```

### Testing

After implementing the fix:

1. **TypeScript Compilation**: Verify no TypeScript errors
   ```bash
   npm run build
   # or
   npx tsc --noEmit
   ```

2. **IDE Autocomplete**: Check that `download_intent` appears in autocomplete when typing `trackEvent("...")`

3. **Runtime Verification**: Ensure the event still tracks correctly in production

### Related Files

- **Issue File**: `lib/analytics.ts` (TypeScript type definition)
- **Usage Location**: `components/download-hero-section.tsx` (lines 47, 65)
- **Documentation**: `docs/google-analytics-implementation.md` (updated to note this issue)

### Priority

**MEDIUM** - This is a code quality and developer experience issue:
- Does not break functionality
- Improves type safety and maintainability
- Prevents future bugs from typos

### Status

🔴 **OPEN** - Awaiting implementation

---

## Issue #3: Documentation References Incorrect Event Name `form_error`

### Summary

The Google Analytics implementation documentation (`docs/google-analytics-implementation.md`) referenced an event called `form_error`, but the actual codebase uses `form_validation_error`. This documentation error has been fixed, but serves as a reminder to keep documentation in sync with code.

### Context

#### Event Naming Pattern

The codebase uses a consistent naming pattern for form-related events:
- `form_start` - User begins filling a form
- `form_step_complete` - User completes a form step
- `form_validation_error` - Form validation fails ✅ (actual event name)
- `form_submit_error` - Form submission fails
- etc.

#### Documentation Error

The documentation incorrectly referenced:
- ❌ `form_error` (mentioned in docs but doesn't exist)
- ✅ `form_validation_error` (actual event name used in code)

### The Problem

#### Documentation Inaccuracy

1. **Developer Confusion**: Developers reading docs might look for `form_error` and not find it
2. **Incorrect Implementation**: New developers might implement `form_error` instead of `form_validation_error`
3. **Search Issues**: Searching codebase for `form_error` won't find the actual implementation

#### Impact

- **Developer Experience**: Misleading documentation
- **Code Consistency**: Risk of introducing incorrect event names
- **Maintenance**: Documentation drift from actual implementation

### Root Cause Analysis

Documentation was written before the actual event name was finalized, or the event name was changed in code without updating the documentation.

### Recommended Solution

#### ✅ Already Fixed

The documentation has been updated in `docs/google-analytics-implementation.md`:
- Changed `form_error` references to `form_validation_error`
- Updated monitoring section to reference correct event names
- Added clarification about event usage

#### Prevention

To prevent similar issues in the future:

1. **Documentation Sync Check**: When adding new events, update both code and docs
2. **Code-First Approach**: Write code first, then document what exists
3. **Regular Audits**: Periodically verify documentation matches codebase
4. **TypeScript as Source of Truth**: Use the `AnalyticsEvent` type as the authoritative list

### Testing

The fix has been verified by:
1. ✅ Searching codebase for `form_error` - no matches found
2. ✅ Searching codebase for `form_validation_error` - found in `lib/analytics.ts` and usage locations
3. ✅ Documentation updated to match actual implementation

### Related Files

- **Documentation**: `docs/google-analytics-implementation.md` (updated)
- **Type Definition**: `lib/analytics.ts` (contains `form_validation_error`)
- **Usage**: `app/marketplace/(landing-page-onboarding-form)/personal-trainer-website/PersonalTrainerWebsitePage.tsx` (line 197)

### Priority

**LOW** - This issue has been resolved:
- ✅ Documentation updated
- ✅ No code changes needed
- Serves as a reminder for future documentation maintenance

### Status

🟢 **RESOLVED** - Documentation updated to match codebase

---

## Issue #4: Marketplace Location Features - Missing Fallback Options

### Summary

The marketplace location detection system only supports GPS-based geolocation and lacks fallback options for users who deny location permissions or when GPS is unavailable. The implementation is missing IP-based location detection and manual location entry, which were planned in the original design document.

### Context

#### Current Implementation Status

The marketplace location features are **partially implemented** (Phase 1 & 2 complete, Phase 3 partial):

**✅ Implemented:**
- GPS location detection via `useUserLocation` hook
- Distance calculation using Haversine formula
- Radius-based filtering (5km - 200km)
- Remote trainer support
- Proximity sorting
- "Trainers Near You" sections
- Distance display in trainer cards

**❌ Missing:**
- IP-based location fallback
- Manual location entry option
- Enhanced error handling for denied permissions

#### Implementation Details

**Location:** `app/marketplace/(marketplace)/utils/location.tsx`

The `useUserLocation` hook currently only implements GPS detection:

```typescript
// Current implementation (lines 20-54)
const requestLocation = async () => {
  try {
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        })
      })
      // ... GPS location handling
    } else {
      throw new Error('Geolocation not supported')
    }
  } catch (err) {
    setError('Unable to detect your location')
    return null  // ❌ No fallback here
  }
}
```

#### Original Design Intent

According to `docs/marketplace-location-features.md`, the system was designed with a three-tier fallback strategy:

1. **Primary**: Browser geolocation API ✅ (implemented)
2. **Fallback 1**: IP-based location service ❌ (not implemented)
3. **Fallback 2**: Manual location entry ❌ (not implemented)

### The Problem

#### User Experience Issues

1. **Permission Denied Scenario**
   - User denies location permission → Only sees error message
   - No alternative way to set location
   - Must use location-agnostic search (less effective)

2. **GPS Unavailable**
   - Users on devices without GPS (some tablets, desktops)
   - Users in areas with poor GPS signal
   - No graceful degradation to IP-based location

3. **Privacy Concerns**
   - Some users prefer not to share precise GPS location
   - No option for approximate location (city-level via IP)
   - No manual entry for privacy-conscious users

#### Impact

- **Reduced Functionality**: Users who can't/won't use GPS miss out on location-based features
- **Poor UX**: Error message without alternatives feels like a dead end
- **Accessibility**: Desktop users and users with GPS-disabled devices have limited experience
- **Conversion**: Users may abandon the marketplace if they can't use location features

### Root Cause Analysis

The implementation prioritized the primary GPS flow and didn't implement the fallback mechanisms. The `UserLocation` interface supports multiple sources (`'gps' | 'ip' | 'manual'`), but only `'gps'` is actually implemented.

### Recommended Solution

#### Step 1: Add IP-Based Location Service

Implement IP-based geolocation using a service like:
- **ipapi.co** (free tier: 1,000 requests/day)
- **ip-api.com** (free tier: 45 requests/minute)
- **ipgeolocation.io** (free tier: 1,000 requests/month)

```typescript
// Add to utils/location.tsx

const getIPBasedLocation = async (): Promise<UserLocation | null> => {
  try {
    // Using ip-api.com (free, no API key required)
    const response = await fetch('http://ip-api.com/json/')
    const data = await response.json()
    
    if (data.status === 'success') {
      return {
        lat: data.lat,
        lng: data.lon,
        city: data.city,
        country: data.country,
        source: 'ip',
        accuracy: undefined // IP-based is less accurate
      }
    }
    return null
  } catch (error) {
    console.error('IP-based location failed:', error)
    return null
  }
}
```

#### Step 2: Add Manual Location Entry

Create a manual location input component:

```typescript
// Add to utils/location.tsx or create separate component

interface ManualLocationInputProps {
  onLocationSet: (location: UserLocation) => void
  onCancel: () => void
}

export function ManualLocationInput({ onLocationSet, onCancel }: ManualLocationInputProps) {
  const [city, setCity] = useState('')
  const [country, setCountry] = useState('')
  
  const handleGeocode = async () => {
    // Use geocoding API (e.g., OpenStreetMap Nominatim, Google Geocoding)
    // Convert city/country to coordinates
    // Then call onLocationSet with coordinates
  }
  
  // ... UI implementation
}
```

#### Step 3: Update useUserLocation Hook

Modify the hook to implement the fallback chain:

```typescript
const requestLocation = async () => {
  setIsLoading(true)
  setError(null)

  // 1. Try GPS first
  try {
    if (navigator.geolocation) {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        })
      })

      const location: UserLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        city: 'Your Location',
        country: 'Detected',
        accuracy: position.coords.accuracy,
        source: 'gps'
      }

      setUserLocation(location)
      return location
    }
  } catch (err) {
    // GPS failed, try IP-based fallback
    console.log('GPS location failed, trying IP-based...')
  }

  // 2. Fallback to IP-based location
  try {
    const ipLocation = await getIPBasedLocation()
    if (ipLocation) {
      setUserLocation(ipLocation)
      return ipLocation
    }
  } catch (err) {
    console.log('IP-based location failed')
  }

  // 3. Show manual entry option
  setError('Unable to detect your location automatically. Please enter your location manually.')
  return null
}
```

#### Step 4: Update LocationDetector Component

Enhance the component to show manual entry option when GPS fails:

```typescript
export function LocationDetector({ onLocationDetected, onError, className }: LocationDetectorProps) {
  const [showManualInput, setShowManualInput] = useState(false)
  const { userLocation, isLoading, error, requestLocation } = useUserLocation()

  const handleLocationRequest = async () => {
    const location = await requestLocation()
    if (location) {
      onLocationDetected(location)
    } else if (error) {
      // Show manual entry option
      setShowManualInput(true)
      onError(error)
    }
  }

  if (showManualInput) {
    return (
      <ManualLocationInput
        onLocationSet={(location) => {
          onLocationDetected(location)
          setShowManualInput(false)
        }}
        onCancel={() => setShowManualInput(false)}
      />
    )
  }

  // ... existing button UI
}
```

### Testing

After implementing the fix:

1. **GPS Denied Test**: Deny location permission → Should fallback to IP-based
2. **GPS Unavailable Test**: Disable GPS on device → Should use IP-based
3. **IP Blocked Test**: Block IP geolocation API → Should show manual entry
4. **Manual Entry Test**: Enter city/country → Should geocode and set location
5. **Accuracy Comparison**: Verify GPS > IP > Manual in terms of accuracy

### Related Files

- **Implementation**: `app/marketplace/(marketplace)/utils/location.tsx`
- **Usage**: `app/marketplace/(marketplace)/MarketplaceClientPage.tsx`
- **Documentation**: `docs/marketplace-location-features.md` (updated to reflect current status)
- **Types**: `app/marketplace/(marketplace)/(marketplace-trainers)/types.ts`

### Priority

**MEDIUM** - This is a UX enhancement issue:
- Does not break existing functionality
- Improves accessibility and user experience
- Increases feature adoption for users who can't/won't use GPS
- Aligns with original design intent

### Status

🔴 **OPEN** - Awaiting implementation

---

## Issue #5: Marketplace Location Features - Missing LocationFilter Component

### Summary

The marketplace location filtering functionality is implemented inline in `MarketplaceClientPage.tsx` rather than as a separate reusable `LocationFilter` component as originally designed. This reduces code reusability and makes the main component harder to maintain.

### Context

#### Current Implementation

**Location:** `app/marketplace/(marketplace)/MarketplaceClientPage.tsx` (lines 223-245)

The location filtering UI is embedded directly in the marketplace page:

```typescript
// Inline implementation (lines 223-245)
{userLocation && (
  <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <Label htmlFor="radius">Within:</Label>
      <Select value={radius.toString()} onValueChange={(value) => setRadius(parseInt(value))}>
        <SelectTrigger className="w-32">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="5">5km</SelectItem>
          <SelectItem value="10">10km</SelectItem>
          {/* ... more options */}
        </SelectContent>
      </Select>
    </div>
  </div>
)}
```

#### Original Design Intent

According to `docs/marketplace-location-features.md`, a separate `LocationFilter` component was planned:

```typescript
interface LocationFilterProps {
  onRadiusChange: (radius: number) => void
  onRemoteToggle: (showRemote: boolean) => void
  currentRadius: number
  showRemote: boolean
}
```

### The Problem

#### Code Organization Issues

1. **Lack of Reusability**: Filtering UI cannot be reused in other components
2. **Component Bloat**: `MarketplaceClientPage.tsx` is already 432 lines - adding more inline code makes it harder to maintain
3. **Testing Difficulty**: Harder to test filtering logic in isolation
4. **Inconsistent Pattern**: Other filters (specialties) could benefit from similar component structure

#### Missing Features

The inline implementation is missing some planned features:
- ❌ Remote trainer toggle (remote trainers are always shown)
- ❌ "Show all" option (defaults to showing all when no location)
- ❌ Better visual organization

### Root Cause Analysis

The component was likely implemented inline for speed and hasn't been refactored into a separate component yet. The functionality works, but the code organization could be improved.

### Recommended Solution

#### Step 1: Create LocationFilter Component

Create a new component file: `app/marketplace/(marketplace)/components/LocationFilter.tsx`

```typescript
"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface LocationFilterProps {
  currentRadius: number
  showRemote: boolean
  onRadiusChange: (radius: number) => void
  onRemoteToggle: (showRemote: boolean) => void
  onClearLocation?: () => void
}

export function LocationFilter({
  currentRadius,
  showRemote,
  onRadiusChange,
  onRemoteToggle,
  onClearLocation
}: LocationFilterProps) {
  const radiusOptions = [5, 10, 25, 50, 75, 100, 150, 200]

  return (
    <div className="flex flex-wrap gap-4 items-center mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <Label htmlFor="radius">Within:</Label>
        <Select 
          value={currentRadius.toString()} 
          onValueChange={(value) => onRadiusChange(parseInt(value))}
        >
          <SelectTrigger className="w-32" id="radius">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {radiusOptions.map((radius) => (
              <SelectItem key={radius} value={radius.toString()}>
                {radius}km
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="show-remote"
          checked={showRemote}
          onCheckedChange={onRemoteToggle}
        />
        <Label htmlFor="show-remote" className="cursor-pointer">
          Show remote trainers
        </Label>
      </div>

      {onClearLocation && (
        <button
          onClick={onClearLocation}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear location
        </button>
      )}
    </div>
  )
}
```

#### Step 2: Update MarketplaceClientPage

Refactor the inline implementation to use the new component:

```typescript
// Add import
import { LocationFilter } from "./components/LocationFilter"

// Add state for remote toggle
const [showRemote, setShowRemote] = useState(true)

// Replace inline filter UI (lines 223-245) with:
{userLocation && (
  <LocationFilter
    currentRadius={radius}
    showRemote={showRemote}
    onRadiusChange={setRadius}
    onRemoteToggle={setShowRemote}
    onClearLocation={() => {
      setUserLocation(null)
      setShowLocationSections(false)
    }}
  />
)}
```

#### Step 3: Update Filtering Logic

Update `getFilteredTrainers` to respect the `showRemote` toggle:

```typescript
const getFilteredTrainers = (trainers: typeof allTrainers) => {
  let filtered = trainers.filter(matchesFilters)
  
  if (userLocation) {
    filtered = filtered.filter(trainer => {
      // Respect remote toggle
      if (trainer.remoteAvailable && !showRemote) return false
      
      // Always show remote trainers if toggle is on
      if (trainer.remoteAvailable) return true
      
      // ... rest of distance filtering
    })
  }
  
  return filtered
}
```

### Testing

After implementing the fix:

1. **Component Isolation**: Test `LocationFilter` component independently
2. **State Management**: Verify radius and remote toggle work correctly
3. **Filtering Logic**: Ensure remote trainers are filtered based on toggle
4. **Clear Location**: Test that clearing location resets filters
5. **Visual Consistency**: Ensure UI matches existing design

### Related Files

- **Current Implementation**: `app/marketplace/(marketplace)/MarketplaceClientPage.tsx` (lines 223-245)
- **New Component**: `app/marketplace/(marketplace)/components/LocationFilter.tsx` (to be created)
- **Documentation**: `docs/marketplace-location-features.md`

### Priority

**LOW** - This is a code organization improvement:
- Does not affect functionality
- Improves maintainability and reusability
- Makes code easier to test
- Can be done as part of a refactoring pass

### Status

🔴 **OPEN** - Awaiting implementation

---

## Issue #6: Marketplace Location Features - Missing Smart Recommendations

### Summary

The marketplace location features implementation is missing the "Smart Recommendations" feature planned in Phase 3. The system currently shows trainers sorted by distance, but doesn't provide intelligent recommendations based on location, user preferences, or trainer availability.

### Context

#### Current Implementation

**Location:** `app/marketplace/(marketplace)/MarketplaceClientPage.tsx` (lines 78-120)

The current filtering and sorting logic:

```typescript
// Current sorting (lines 100-116)
filtered.sort((a, b) => {
  // Remote trainers go to the end
  if (a.remoteAvailable && !b.remoteAvailable) return 1
  if (!a.remoteAvailable && b.remoteAvailable) return -1
  
  // Sort by distance
  if (distanceA !== null && distanceB !== null) {
    return distanceA - distanceB
  }
  
  // Fallback to rating
  return b.rating - a.rating
})
```

#### Original Design Intent

According to `docs/marketplace-location-features.md` Phase 3:

- **Smart Recommendations**: Location-based trainer suggestions
- Should consider multiple factors beyond just distance

### The Problem

#### Limited Personalization

1. **Simple Sorting**: Only considers distance and rating
2. **No Preference Learning**: Doesn't learn from user behavior
3. **No Availability Consideration**: Doesn't factor in trainer availability
4. **No Specialization Matching**: Doesn't prioritize trainers matching user's specialty interests

#### Impact

- **Lower Conversion**: Users may not see the most relevant trainers first
- **Missed Opportunities**: Good trainers might be buried if they're slightly farther away
- **Generic Experience**: All users see the same sorting, regardless of preferences

### Root Cause Analysis

Phase 3 was marked as "partial" - basic proximity sorting was implemented, but smart recommendations were not. This is a feature enhancement rather than a bug.

### Recommended Solution

#### Step 1: Create Recommendation Algorithm

Create a scoring system that considers multiple factors:

```typescript
// Add to utils/location.tsx or create utils/recommendations.ts

interface RecommendationScore {
  trainer: Trainer
  score: number
  factors: {
    distance: number
    rating: number
    specialtyMatch: number
    availability: number
    popularity: number
  }
}

export const calculateRecommendationScore = (
  trainer: Trainer,
  userLocation: UserLocation | null,
  userPreferences: {
    specialties?: string[]
    maxDistance?: number
  }
): RecommendationScore => {
  let score = 0
  const factors = {
    distance: 0,
    rating: 0,
    specialtyMatch: 0,
    availability: 0,
    popularity: 0
  }

  // Distance factor (closer = higher score, max 40 points)
  if (userLocation && trainer.location.coordinates) {
    const distance = calculateDistance(
      userLocation.lat, userLocation.lng,
      trainer.location.coordinates.lat, trainer.location.coordinates.lng
    )
    factors.distance = Math.max(0, 40 - (distance / 10)) // 0km = 40pts, 100km = 0pts
  }

  // Rating factor (max 30 points)
  factors.rating = (trainer.rating / 5) * 30

  // Specialty match (max 20 points)
  if (userPreferences.specialties?.length) {
    const matches = trainer.specialties.filter(s => 
      userPreferences.specialties!.includes(s)
    ).length
    factors.specialtyMatch = (matches / trainer.specialties.length) * 20
  }

  // Popularity factor (reviews count, max 10 points)
  factors.popularity = Math.min(10, trainer.reviews / 10)

  score = factors.distance + factors.rating + factors.specialtyMatch + factors.popularity

  return { trainer, score, factors }
}
```

#### Step 2: Update Sorting Logic

Replace simple distance sorting with recommendation-based sorting:

```typescript
// In MarketplaceClientPage.tsx
const getFilteredTrainers = (trainers: typeof allTrainers) => {
  let filtered = trainers.filter(matchesFilters)
  
  if (userLocation) {
    // ... existing filtering logic
    
    // Sort by recommendation score instead of just distance
    filtered = filtered
      .map(trainer => calculateRecommendationScore(
        trainer,
        userLocation,
        { specialties: selectedSpecialties }
      ))
      .sort((a, b) => b.score - a.score)
      .map(item => item.trainer)
  }
  
  return filtered
}
```

#### Step 3: Add Recommendation Indicators (Optional)

Show why trainers are recommended:

```typescript
// In trainer card
{trainer.recommendationScore && (
  <Badge variant="secondary">
    Recommended: {trainer.recommendationScore > 80 ? 'Highly' : 'Good'} match
  </Badge>
)}
```

### Testing

After implementing the fix:

1. **Score Calculation**: Verify scores are calculated correctly for various scenarios
2. **Sorting Accuracy**: Ensure trainers are sorted by recommendation score
3. **Specialty Matching**: Test that specialty preferences affect recommendations
4. **Distance Weighting**: Verify distance still matters but isn't the only factor
5. **Edge Cases**: Test with no location, no preferences, etc.

### Related Files

- **Current Implementation**: `app/marketplace/(marketplace)/MarketplaceClientPage.tsx`
- **Utilities**: `app/marketplace/(marketplace)/utils/location.tsx`
- **Documentation**: `docs/marketplace-location-features.md`

### Priority

**LOW** - This is a feature enhancement:
- Current functionality works (distance-based sorting)
- Improves user experience and conversion
- Can be implemented incrementally
- Not blocking any critical features

### Status

🔴 **OPEN** - Awaiting implementation

---

## Additional Issues

_Additional issues will be added here as they are discovered during audits._

