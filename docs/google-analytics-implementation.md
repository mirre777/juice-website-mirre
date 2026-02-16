# Google Analytics Implementation Documentation

## Overview

This document outlines the comprehensive Google Analytics 4 (GA4) and Google Tag Manager (GTM) implementation for the Juice fitness app website, including GDPR compliance, performance optimization, and detailed event tracking with enhanced user properties and lead quality scoring.

## Implementation Summary

### Core Features Implemented

- **Production-Only Loading**: GA only loads in production environment to keep development data clean
- **Google Tag Manager**: GTM container (GTM-5375W2FZ) loaded alongside GA4 for advanced tag management
- **GDPR Compliance**: Cookie consent banner with user choice persistence
- **Performance Optimized**: Uses Next.js Script component with `afterInteractive` strategy
- **Type-Safe Event Tracking**: TypeScript utilities for consistent event tracking
- **Enhanced User Properties**: Automatic collection of device, location, and behavioral data
- **Lead Quality Scoring**: Intelligent scoring system for conversion optimization
- **Multi-Step Form Tracking**: Comprehensive form analytics with abandonment tracking
- **App Store Click Tracking**: Detailed download intent tracking

## File Structure

\`\`\`
lib/
├── analytics.ts                    # Core analytics utilities and type definitions
components/
├── analytics-consent-banner.tsx    # GDPR consent banner component
├── analytics-provider.tsx          # Analytics initialization and consent management
app/
├── layout.tsx                     # GA script loading and provider setup
\`\`\`

## Configuration

### Environment Variables

Required environment variable in Vercel:
\`\`\`
NEXT_PUBLIC_GA_TRACKING_ID=G-2N948XX72T
\`\`\`

### Google Analytics Setup

No additional GA4 configuration required - events will automatically appear in:
- **Real-time reports**: Immediate data
- **Standard reports**: 24-48 hours processing time

### Google Tag Manager Setup

Google Tag Manager (GTM) is also implemented with container ID `GTM-5375W2FZ`. GTM loads alongside GA4 and can be used for:
- Advanced tag management and configuration
- Additional third-party integrations
- A/B testing and experimentation
- Custom event triggers

GTM is loaded with `afterInteractive` strategy and does not require user consent (as it's a tag management container, not a tracking script itself).

## Enhanced Event Tracking Implementation

### Core Event Types

All events are defined in `lib/analytics.ts` with TypeScript support:

\`\`\`typescript
export type AnalyticsEvent =
  | "page_view"
  | "sign_up"
  | "purchase"
  | "download_app"
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
\`\`\`

**Note**: The event `download_intent` is used in the codebase (e.g., `download-hero-section.tsx`) but is not currently included in the TypeScript type definition. This should be added to the `AnalyticsEvent` type for type safety.

### Enhanced User Properties

Every event automatically includes these custom properties:

\`\`\`typescript
export interface UserProperties {
  user_type?: "client" | "trainer" | "unknown"
  landing_page_source?: string
  device_type?: "mobile" | "tablet" | "desktop"
  screen_size?: string
  geographic_location?: string
  session_id?: string
}
\`\`\`

**Property Collection Details:**
- **User Type**: Detected from URL path patterns (`/getclients` = trainer, `/findatrainer` = client)
- **Landing Page Source**: UTM parameters, referrer domain, or "direct"
- **Device Type**: Based on screen width breakpoints (768px, 1024px)
- **Screen Size**: Exact viewport dimensions
- **Geographic Location**: Timezone-based location detection
- **Session ID**: Unique session identifier for journey tracking

### Form Analytics Events

#### Multi-Step Form Tracking
- `form_start` - User begins filling any form
  - Parameters: `form_name`, `form_location`, `total_steps`, `form_progress`
- `form_step_complete` - User completes a form step
  - Parameters: `step_number`, `step_name`, `form_progress` (percentage)
- `form_field_focus` - User focuses on a form field
  - Parameters: `field_name`, `field_type`
- `form_field_blur` - User leaves a form field
  - Parameters: `field_completed`, `time_spent_seconds`
- `form_validation_error` - Form validation fails
  - Parameters: `field_name`, `error_message`, `step_number`
- `form_abandon` - User leaves form without completing
  - Parameters: `step_number`, `completion_time_seconds`, `form_progress`
- `form_submit_attempt` - User attempts to submit form
- `form_submit_success` - Form submission succeeds
  - Parameters: `completion_time_seconds`, `lead_quality_score`, `value`
- `form_submit_error` - Form submission fails
  - Parameters: `error_message`, `step_number`

#### Personal Trainer Website Form (6-Step Process)
Special tracking for the multi-step trainer onboarding form:
- Step-by-step completion tracking
- Abandonment analysis at each step
- Lead quality scoring based on form completion
- Time-to-complete measurements

### App Store & Download Tracking

#### App Store Click Events
- `app_store_click` - User clicks app store link
  - Parameters: `store_type` ("app_store" | "play_store"), `click_location`

#### Download Intent Tracking
- `download_app` - General download intent
  - Parameters: `platform`, `location`, `user_type`

### Lead Quality Scoring System

Automatic lead scoring (0-100) based on:

**Landing Page Source (0-20 points)**
- Google/Organic: +20 points
- Direct traffic: +15 points
- Social media: +10 points

**Device Type (0-10 points)**
- Desktop: +10 points
- Tablet: +5 points
- Mobile: 0 points

**Form Completion Quality (0-40 points)**
- Phone number provided: +15 points
- Detailed message (>20 chars): +10 points
- Detailed bio (>50 chars): +15 points

**Geographic Targeting (0-10 points)**
- European markets: +10 points

**Session Engagement (0-10 points)**
- >2 minutes on site: +10 points
- >1 minute on site: +5 points

### Tracked Events by Category

#### Form Events
- `join_waitlist` - Waitlist form submissions (defined in type but not actively used - see `waitlist_submit` instead)
  - Parameters: `user_type`, `plan_type`, `form_location`, `lead_quality_score`
- `form_validation_error` - Form validation failures (used in multi-step forms)
  - Parameters: `field_name`, `error_message`, `step_number`, `form_name`

#### Navigation Events  
- `nav_click` - Menu and section navigation (used in navbar component)
  - Parameters: `link_text`, `destination`, `user_type`
- `cta_click` - Call-to-action button clicks
  - Parameters: `button_text`, `location`, `user_type`

#### Download Events
- `download_app` - General download intent
  - Parameters: `platform`, `location`, `user_type`
- `download_intent` - App download attempts (used in download-hero-section)
  - Parameters: `platform` (ios/android), `location`, `user_type`
  - **Note**: This event is used in code but not in TypeScript type definition

#### Waitlist & Form Events
- `waitlist_submit` - Waitlist form submission initiated
  - Parameters: `user_type`, `plan`, `client_count`
- `early_access_valid_form_submission` - Successful waitlist form submission
  - Parameters: `user_type`, `plan`, `success`, `error_message` (if failed)

#### Engagement Events
- `get_early_access_click` - Early access button clicks
- `talk_to_founders_click` - "Talk to founders" button clicks
- `play_around_button` - "Play around" button clicks
- `login_button_clicked` - Login button clicks
- `login_button` - Login button interaction
- `signup_button` - Signup button clicks
- `tab_click` - Tab navigation clicks
- `scroll_depth` - Page scroll milestones
  - Parameters: `depth_percentage`, `page_section`

### Event Implementation Pattern

All events follow this consistent pattern with automatic user property enhancement:

\`\`\`typescript
import { trackEvent, formAnalytics } from '@/lib/analytics'

// Enhanced button click tracking
onClick={() => {
  trackEvent('cta_click', {
    button_text: 'Download App',
    location: 'hero_section',
    // user_type, device_type, etc. added automatically
  })
}}

// Navigation tracking
onClick={() => {
  trackEvent('nav_click', {
    link_text: 'About',
    destination: '/about',
    // user_type added automatically
  })
}}

// Waitlist form submission
trackEvent('waitlist_submit', {
  user_type: isCoach ? 'trainer' : 'client',
  plan: selectedPlan || 'basic',
  client_count: clientCount
})

// Multi-step form tracking
formAnalytics.formStart('trainer_website', 'marketplace', 6)
formAnalytics.stepComplete('trainer_website', 1, 'basic_info', 6)
formAnalytics.submitSuccess('trainer_website', completionTime, leadScore)
\`\`\`

## Performance Optimizations

### Loading Strategy
- **Script Loading**: `afterInteractive` strategy prevents blocking page render
- **Conditional Loading**: Only loads in production (`NODE_ENV === 'production'`)
- **Consent-Based Init**: GA only initializes after user consent
- **GTM Loading**: Google Tag Manager loads unconditionally (tag management container)
- **Page View Control**: GA4 configured with `send_page_view: false` to prevent automatic page views (handled by AnalyticsProvider)

### Code Splitting
- Analytics utilities are tree-shakeable
- Consent banner only loads when needed
- No impact on initial page load performance

## GDPR Compliance Features

### Consent Management
- **Consent Banner**: Appears on first visit for EU users
- **Choice Persistence**: User preference stored in localStorage
- **Conditional Tracking**: GA only tracks after explicit consent
- **Opt-out Support**: Users can decline analytics tracking

### Privacy Controls
- **Data Minimization**: Only essential events tracked
- **User Control**: Clear accept/decline options
- **Transparent Communication**: Clear explanation of data usage

## Integration with Existing Features

### Trainer Floating Element
- **Conditional Display**: Hidden when consent banner is visible
- **Automatic Show**: Appears after consent decision made
- **Existing Rules**: Maintains page-specific visibility rules

### User Type System
- **Context Tracking**: All events include current user type (trainer/client)
- **Toggle Tracking**: Monitors user type switches for UX insights
- **Personalized Analytics**: Separate funnels for different user types

## Monitoring and Maintenance

### Real-Time Verification
1. Deploy to production
2. Check GA4 Real-time reports within minutes
3. Verify events appear with correct parameters

### Key Metrics to Monitor
- **Form Completion Rates**: Track by form type and user type
- **Lead Quality Scores**: Monitor average scores by traffic source
- **App Store Click-Through**: iOS vs Android preference by region
- **Multi-Step Form Abandonment**: Identify problematic steps
- **User Journey Mapping**: Cross-page behavior analysis

### Regular Monitoring
- **Event Volume**: Monitor for unusual spikes or drops
- **Error Tracking**: Watch for `form_validation_error` and `form_submit_error` events to identify UX issues
- **Conversion Funnels**: Track waitlist signup completion rates (`waitlist_submit` → `early_access_valid_form_submission`)
- **Lead Quality Trends**: Monitor scoring patterns over time

### Debugging
- Development environment shows console logs for event tracking
- Production environment sends events to GA4
- Use browser dev tools to verify gtag calls

## Technical Implementation Details

### Type Safety
All events use TypeScript interfaces for consistency and error prevention.

### Error Handling
- Graceful degradation if GA fails to load
- No impact on app functionality if analytics unavailable
- Console warnings in development for debugging

### Browser Compatibility
- Works with all modern browsers
- Fallback handling for browsers with JavaScript disabled
- No dependencies on external libraries beyond GA4

## Future Enhancements

### Potential Additions
- **Enhanced E-commerce**: Revenue tracking for premium features
- **A/B Testing Integration**: Event-based experiment tracking
- **Custom Dimensions**: Additional user segmentation options
- **Predictive Lead Scoring**: Machine learning-based quality prediction

### Maintenance Tasks
- **Regular Audits**: Quarterly review of tracked events
- **Performance Monitoring**: Monthly check of loading impact
- **Compliance Updates**: Stay current with privacy regulations
- **Lead Score Calibration**: Adjust scoring algorithm based on conversion data

---

## Complete Event Reference

### All Events Defined in analytics.ts:
✅ **Page Tracking**: `page_view`
✅ **User Actions**: `sign_up`, `join_waitlist`, `contact_trainer`
✅ **App Downloads**: `download_app`, `app_store_click`
✅ **Form Interactions**: `form_start`, `form_step_complete`, `form_field_focus`, `form_field_blur`, `form_validation_error`, `form_abandon`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`
✅ **Waitlist Events**: `waitlist_submit`, `early_access_valid_form_submission`
✅ **Navigation**: `nav_click`, `cta_click`, `tab_click`
✅ **Engagement**: `view_pricing`, `scroll_depth`, `get_early_access_click`, `talk_to_founders_click`, `play_around_button`
✅ **Authentication**: `login_button_clicked`, `login_button`, `signup_button`
✅ **Fitness**: `start_workout`, `complete_workout`
✅ **E-commerce**: `purchase`

### Events Used But Not in Type Definition:
⚠️ **Download Intent**: `download_intent` - Used in `download-hero-section.tsx` but missing from `AnalyticsEvent` type (should be added for type safety)

### Custom Properties Included in All Events:
✅ **User Context**: `user_type`, `session_id`
✅ **Technical**: `device_type`, `screen_size`
✅ **Attribution**: `landing_page_source`, `geographic_location`
✅ **Quality Scoring**: `lead_quality_score` (for conversion events)
