# Trainer Content Editor System

## 🎯 Overview
The inline content editor allows activated trainers to customize their website content after payment. This system provides a user-friendly interface for editing all website sections.

## 🔧 Current Implementation Status

### ⚠️ **NOT IMPLEMENTED** - Editor Interface
- **Location**: `/marketplace/trainer/[id]/edit` - **DOES NOT EXIST**
- **Component**: `TrainerContentEditor.tsx` - **DOES NOT EXIST**
- **Status**: This feature has not been implemented yet

### ⚠️ **NOT IMPLEMENTED** - API Integration
- **Endpoint**: `/api/trainer/content/[id]` - **DOES NOT EXIST**
- **Methods**: GET (fetch content), PUT (update content) - **NOT IMPLEMENTED**
- **Status**: API endpoints need to be created

### ⚠️ **NOT IMPLEMENTED** - Live Profiles
- **Issue**: Trainer profile pages don't exist
- **Current**: No profile pages to display content
- **Needed**: Create `app/marketplace/trainer/[id]/page.tsx` first

## 🎨 Editor Features

### Hero Section Editor
\`\`\`typescript
hero: {
  title: string        // "Transform Your Body, Transform Your Life"
  subtitle: string     // "Professional CrossFit Coach • 5+ Years Experience"
  description: string  // Detailed introduction paragraph
}
\`\`\`

### About Section Editor
\`\`\`typescript
about: {
  title: string    // "About Me" 
  content: string  // Multi-paragraph bio with \n support
}
\`\`\`

### Services Manager
\`\`\`typescript
services: Service[] = [{
  id: string
  title: string        // "Personal Training Session"
  description: string  // Service details
  price: number       // 60 (euros)
  duration: string    // "60 minutes"
  featured: boolean   // Highlight service
}]
\`\`\`

### Contact Editor
\`\`\`typescript
contact: {
  title: string       // "Let's Start Your Fitness Journey"
  description: string // Call-to-action text
  email: string      // Trainer email address
  phone: string      // Trainer phone number
  city: string       // Trainer city
  district: string   // Trainer district/neighborhood
}
\`\`\`

### SEO Settings
\`\`\`typescript
seo: {
  title: string       // Page title for search engines
  description: string // Meta description
}
\`\`\`

## 🔐 Security & Access Control

### Authentication Flow
1. Check if trainer exists and is active
2. Verify trainer ownership (future: user auth)
3. Allow content editing only for active status
4. Validate all input data before saving

### API Security
\`\`\`typescript
// Only active trainers can edit
if (trainer.status !== "active") {
  return NextResponse.json(
    { error: "Only active trainers can edit content" }, 
    { status: 403 }
  )
}
\`\`\`

## 🎯 User Experience

### Editor Layout
- **Left Panel**: Form inputs for editing content
- **Right Panel**: Live preview (future enhancement)
- **Header**: Save button, preview link, back navigation
- **Sections**: Organized by website sections

### Save Functionality
- Real-time validation
- Success/error notifications
- Automatic content versioning
- Optimistic UI updates

## 🚀 Integration Points

### Current Working Flow
1. Trainer activates account (payment complete)
2. Trainer visits `/marketplace/trainer/[id]/edit`
3. Editor loads with default generated content
4. Trainer customizes content and saves
5. Content stored in `trainer.content` field

### Missing Integration
1. Live profile pages need to use `trainer.content`
2. Public URLs should display edited content
3. SEO meta tags should use custom SEO settings

## 🔧 Technical Implementation

### Content Storage
\`\`\`typescript
// Firebase document structure
trainers/[trainerId] = {
  // ... trainer basic info
  content: TrainerContent,  // Edited content (default generated on temp trainer creation)
  status: "active"
  customization: {
    lastUpdated: string
    version: number
    isDraft: boolean
  }
}
\`\`\`

### Content Generation
- Default content is automatically generated when a temp trainer is created
- Content structure matches `TrainerContent` interface from `/types/trainer.ts`
- Default content is created in `lib/firebase-trainer.ts` → `TrainerService.createTempTrainer()`
- Content includes pre-filled values based on trainer form data

### Type Definitions
**Note**: There are two content-related interfaces in `/types/trainer.ts`:
- `TrainerContent` - Used for storing/displaying content (matches Firebase structure)
- `EditableTrainerContent` - More flexible interface for editing (includes optional fields and additional customization options)

### API Endpoints
- `GET /api/trainer/content/[id]` - Fetch trainer and content - **NOT IMPLEMENTED**
- `PUT /api/trainer/content/[id]` - Update content - **NOT IMPLEMENTED**
- `POST /api/trainer/activate` - Activate trainer after payment - **NOT IMPLEMENTED** (referenced in `/app/payment/success/page.tsx` but doesn't exist)

### Components
- `TrainerContentEditor.tsx` - Main editor interface
- `TrainerProfilePage.tsx` - Public profile (needs content integration)

## 🎨 UI Components Used
- Cards for section organization
- Input/Textarea for text editing
- Buttons for actions (save, add, remove)
- Badges for service features
- Labels for form organization
- Toast notifications for feedback

## 📝 Next Steps
1. **Update TrainerProfilePage**: Use `trainer.content` instead of default data
2. **Add Live Preview**: Real-time preview while editing
3. **SEO Integration**: Use custom SEO settings in page metadata
4. **Image Upload**: Allow trainers to upload profile/service images
5. **Template System**: Multiple design templates to choose from

## 🐛 Current Limitations
- No real-time preview while editing
- No image upload functionality
- No template customization options
- No undo/redo functionality
- No content versioning history

## 🔗 Related Files

### **Files That Exist:**
- `/types/trainer.ts` - Type definitions (EXISTS) - Contains both `TrainerContent` and `EditableTrainerContent` interfaces
- `/app/marketplace/(landing-page-onboarding-form)/personal-trainer-website/PersonalTrainerWebsitePage.tsx` - Form (EXISTS)
- `/app/api/payments/stripe-webhook/route.ts` - Activation via webhook (EXISTS)
- `/lib/firebase-trainer.ts` - Trainer service with content generation (EXISTS) - Creates default content on temp trainer creation
- `/app/payment/success/page.tsx` - Payment success page (EXISTS) - References non-existent `/api/trainer/activate` and `/marketplace/trainer/[id]` routes

### **Files That Need to Be Created:**
- `/app/marketplace/trainer/[id]/edit/page.tsx` - **NEEDS TO BE CREATED**
- `/app/marketplace/trainer/[id]/edit/TrainerContentEditor.tsx` - **NEEDS TO BE CREATED**
- `/app/api/trainer/content/[id]/route.ts` - **NEEDS TO BE CREATED** (GET/PUT endpoints)
- `/app/api/trainer/activate/route.ts` - **NEEDS TO BE CREATED** (referenced by payment success page)
- `/app/marketplace/trainer/[id]/page.tsx` - **NEEDS TO BE CREATED** (profile page - referenced by payment success redirect)
- `/app/marketplace/public-trainer-page/[id]/page.tsx` - **NEEDS TO BE CREATED** (optional standalone public profiles)

### **Known Issues:**
- Payment success page (`/app/payment/success/page.tsx`) calls `/api/trainer/activate` which doesn't exist
- Payment success page redirects to `/marketplace/trainer/[id]` which doesn't exist
- Default content is generated but there's no way to edit it yet
