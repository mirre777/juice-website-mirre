# Trainer Content Editor System

## 🎯 Overview
The inline content editor allows activated trainers to customize their website content after payment. This system provides a user-friendly interface for editing all website sections.

## 🔧 Current Implementation Status

### ✅ COMPLETE: Editor Interface
- **Location**: `/marketplace/trainer/[id]/edit`
- **Component**: `TrainerContentEditor.tsx`
- **Functionality**:
  - Hero section editing (title, subtitle, description)
  - About section editing (title, content)
  - Services management (add, edit, remove services)
  - Contact section editing
  - SEO settings (title, meta description)
  - Real-time preview updates
  - Save functionality with API integration

### ✅ COMPLETE: API Integration
- **Endpoint**: `/api/trainer/content/[id]`
- **Methods**: GET (fetch content), PUT (update content)
- **Security**: Only active trainers can edit content
- **Validation**: Proper error handling and data validation

### 🔄 MISSING: Integration with Live Profiles
- **Issue**: Live trainer profiles don't use the edited content yet
- **Current**: Profiles show default/original data
- **Needed**: Update `TrainerProfilePage.tsx` to use `trainer.content`

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
  phone: string      // Optional phone number
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
  content: TrainerContent,  // Edited content
  status: "active"
}
\`\`\`

### API Endpoints
- `GET /api/trainer/content/[id]` - Fetch trainer and content
- `PUT /api/trainer/content/[id]` - Update content

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
- `/app/marketplace/trainer/[id]/edit/page.tsx`
- `/app/marketplace/trainer/[id]/edit/TrainerContentEditor.tsx`
- `/app/api/trainer/content/[id]/route.ts`
- `/app/marketplace/trainer/[id]/TrainerProfilePage.tsx` (needs update)
- `/types/trainer.ts`
