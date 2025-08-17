# Trainer Website Editor - Feature Implementation Plan

## Overview
This document outlines the comprehensive plan for implementing content editing functionality for trainer websites. This feature will transform the current "one-time generation" system into a full website management platform.

---

## System Architecture

### New Components Required
1. **Trainer Dashboard** - Central management hub
2. **Content Editor** - Inline editing interface  
3. **Style Customizer** - Design customization tools
4. **Preview System** - Real-time preview functionality
5. **Publishing System** - Draft/live content management

### Database Schema Extensions
\`\`\`typescript
interface TrainerDocument {
  // ... existing fields
  
  // NEW: Editable content structure
  content: EditableTrainerContent
  
  // NEW: Customization settings
  customization: {
    lastUpdated: Date
    version: number
    isDraft: boolean
  }
  
  // NEW: Website settings
  settings: {
    isPublished: boolean
    customDomain?: string
    seoTitle: string
    seoDescription: string
  }
}

interface EditableTrainerContent {
  // Hero Section
  heroTitle: string           // "Transform Your Body, Transform Your Life"
  heroSubtitle: string        // "Certified Personal Trainer specializing in..."
  heroCallToAction: string    // "Book Your Free Consultation"
  
  // About Section  
  aboutHeading: string        // "About [Name]"
  aboutContent: string        // Bio paragraph
  aboutHighlights: string[]   // ["5+ Years Experience", "200+ Clients"]
  
  // Services Section
  servicesHeading: string     // "My Training Services"
  services: Array<{
    title: string             // "Personal Training"
    description: string       // "One-on-one customized workouts"
    price: string            // "€80/session"
    duration: string         // "60 minutes"
    isActive: boolean        // Show/hide service
  }>
  
  // Testimonials Section
  testimonialsHeading: string // "What My Clients Say"
  testimonials: Array<{
    name: string
    text: string
    rating: number
    isActive: boolean
  }>
  
  // Contact Section
  contactHeading: string      // "Ready to Start Your Journey?"
  contactSubtext: string      // "Get in touch to schedule..."
  
  // Styling Options
  primaryColor: string        // "#D2FF28" (brand color)
  secondaryColor: string      // Custom accent color
  fontStyle: 'modern' | 'classic' | 'bold'
  layoutStyle: 'minimal' | 'dynamic' | 'professional'
}
\`\`\`

---

## Implementation Phases

### Phase 1: Trainer Dashboard (4-6 hours)

#### Location
- **Page**: `/marketplace/trainer/[id]/dashboard`
- **Component**: `TrainerDashboard.tsx`

#### Features
- **Website Overview**: Current website statistics
- **Quick Actions**: Edit content, view live site, settings
- **Recent Changes**: History of content updates
- **Performance Metrics**: Page views, contact form submissions

#### Dashboard Layout
\`\`\`typescript
// Dashboard sections
- Header with trainer name and website status
- Quick stats cards (views, contacts, last updated)
- Action buttons (Edit Content, View Live, Settings)
- Recent activity feed
- Website preview thumbnail
\`\`\`

#### Authentication
- **Access Control**: Only activated trainers can access
- **Session Management**: Secure trainer authentication
- **Permission Validation**: Verify trainer owns the profile

### Phase 2: Content Editor Interface (6-8 hours)

#### Location
- **Page**: `/marketplace/trainer/[id]/edit`
- **Component**: `TrainerContentEditor.tsx`

#### Editing Modes
1. **Inline Editing**: Click-to-edit text elements
2. **Section Editor**: Dedicated editors for complex content
3. **Visual Editor**: WYSIWYG editing experience

#### Editable Components

##### A. Inline Text Editor
\`\`\`typescript
<EditableText 
  value={content.heroTitle}
  onChange={(value) => updateContent('heroTitle', value)}
  placeholder="Enter your hero title..."
  maxLength={60}
  className="text-4xl font-bold"
  multiline={false}
/>
\`\`\`

##### B. Rich Text Editor
\`\`\`typescript
<EditableRichText
  value={content.aboutContent}
  onChange={(value) => updateContent('aboutContent', value)}
  placeholder="Tell your story..."
  maxLength={500}
  toolbar={['bold', 'italic', 'link']}
/>
\`\`\`

##### C. Service Manager
\`\`\`typescript
<ServiceEditor 
  services={content.services}
  onUpdate={(services) => updateContent('services', services)}
  onAdd={() => addNewService()}
  onRemove={(index) => removeService(index)}
  onReorder={(oldIndex, newIndex) => reorderServices(oldIndex, newIndex)}
/>
\`\`\`

##### D. Testimonial Manager
\`\`\`typescript
<TestimonialEditor
  testimonials={content.testimonials}
  onUpdate={(testimonials) => updateContent('testimonials', testimonials)}
  onAdd={() => addNewTestimonial()}
  onRemove={(index) => removeTestimonial(index)}
/>
\`\`\`

#### Auto-Save System
\`\`\`typescript
// Auto-save implementation
const [content, setContent] = useState<EditableTrainerContent>()
const [isDirty, setIsDirty] = useState(false)
const [isSaving, setIsSaving] = useState(false)
const [lastSaved, setLastSaved] = useState<Date>()

// Auto-save every 30 seconds if changes exist
useEffect(() => {
  if (isDirty) {
    const timer = setTimeout(() => {
      saveContent()
    }, 30000)
    return () => clearTimeout(timer)
  }
}, [isDirty, content])

// Manual save function
const saveContent = async () => {
  setIsSaving(true)
  try {
    await updateTrainerContent(trainerId, content)
    setIsDirty(false)
    setLastSaved(new Date())
  } catch (error) {
    // Handle save error
  } finally {
    setIsSaving(false)
  }
}
\`\`\`

### Phase 3: Style Customization (4-6 hours)

#### Style Customizer Component
\`\`\`typescript
<StyleCustomizer 
  primaryColor={content.primaryColor}
  secondaryColor={content.secondaryColor}
  fontStyle={content.fontStyle}
  layoutStyle={content.layoutStyle}
  onChange={(styles) => updateStyles(styles)}
/>
\`\`\`

#### Customization Options

##### Color Picker
- **Primary Color**: Main brand color
- **Secondary Color**: Accent color
- **Preset Palettes**: Professional color combinations
- **Color Validation**: Ensure accessibility compliance

##### Typography Options
- **Font Styles**: Modern, Classic, Bold
- **Font Sizes**: Heading and body text scaling
- **Line Spacing**: Text readability options

##### Layout Styles
- **Minimal**: Clean, simple design
- **Dynamic**: Animated, modern layout
- **Professional**: Traditional, corporate style

#### Real-time Preview
- **Live Updates**: Changes reflected immediately
- **Mobile Preview**: Responsive design preview
- **Before/After**: Compare original vs. customized

### Phase 4: Advanced Features (6-8 hours)

#### Image Management
\`\`\`typescript
<ImageUploader
  currentImage={content.profileImage}
  onUpload={(imageUrl) => updateContent('profileImage', imageUrl)}
  maxSize={5 * 1024 * 1024} // 5MB limit
  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
/>
\`\`\`

#### SEO Optimization
\`\`\`typescript
<SEOEditor
  title={settings.seoTitle}
  description={settings.seoDescription}
  keywords={settings.seoKeywords}
  onUpdate={(seoData) => updateSEOSettings(seoData)}
/>
\`\`\`

#### Analytics Integration
- **Page Views**: Track website visits
- **Contact Form**: Monitor inquiry submissions
- **Popular Sections**: Most viewed content areas
- **Traffic Sources**: Referral tracking

---

## API Endpoints

### Content Management
\`\`\`typescript
// GET /api/trainer/[id]/content - Fetch editable content
// PUT /api/trainer/[id]/content - Save content changes  
// POST /api/trainer/[id]/preview - Generate preview
// PUT /api/trainer/[id]/publish - Publish changes
\`\`\`

### Image Management
\`\`\`typescript
// POST /api/trainer/[id]/upload - Upload images
// DELETE /api/trainer/[id]/image/[imageId] - Delete image
// GET /api/trainer/[id]/images - List uploaded images
\`\`\`

### Analytics
\`\`\`typescript
// GET /api/trainer/[id]/analytics - Fetch analytics data
// POST /api/trainer/[id]/analytics/event - Track custom events
\`\`\`

---

## State Management

### Content State
\`\`\`typescript
interface ContentEditorState {
  content: EditableTrainerContent
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null
  errors: Record<string, string>
  previewMode: boolean
}
\`\`\`

### Editor Context
\`\`\`typescript
const ContentEditorContext = createContext<{
  state: ContentEditorState
  updateContent: (field: string, value: any) => void
  saveContent: () => Promise<void>
  togglePreview: () => void
  resetChanges: () => void
}>()
\`\`\`

---

## User Experience Flow

### 1. Dashboard Access
\`\`\`
Trainer logs in → Dashboard overview → Edit content button
\`\`\`

### 2. Content Editing
\`\`\`
Edit mode → Select section → Make changes → Auto-save → Preview
\`\`\`

### 3. Publishing
\`\`\`
Review changes → Publish button → Live website updated
\`\`\`

### 4. Ongoing Management
\`\`\`
Dashboard → Analytics → Content updates → Style changes
\`\`\`

---

## Technical Implementation

### Frontend Architecture
\`\`\`typescript
// Component structure
TrainerDashboard/
├── DashboardHeader.tsx
├── StatsCards.tsx
├── QuickActions.tsx
├── RecentActivity.tsx
└── WebsitePreview.tsx

ContentEditor/
├── EditorHeader.tsx
├── ContentSections/
│   ├── HeroEditor.tsx
│   ├── AboutEditor.tsx
│   ├── ServicesEditor.tsx
│   └── TestimonialsEditor.tsx
├── StyleCustomizer.tsx
└── PreviewPanel.tsx
\`\`\`

### Backend Services
\`\`\`typescript
// Service layer
class TrainerContentService {
  async getContent(trainerId: string): Promise<EditableTrainerContent>
  async updateContent(trainerId: string, content: Partial<EditableTrainerContent>): Promise<void>
  async publishContent(trainerId: string): Promise<void>
  async createBackup(trainerId: string): Promise<string>
  async restoreBackup(trainerId: string, backupId: string): Promise<void>
}
\`\`\`

---

## Security Considerations

### Access Control
- **Trainer Authentication**: Verify trainer identity
- **Profile Ownership**: Ensure trainer owns the profile
- **Session Management**: Secure session handling

### Data Validation
- **Input Sanitization**: Prevent XSS attacks
- **Content Validation**: Validate all user inputs
- **File Upload Security**: Secure image uploads

### Rate Limiting
- **Save Operations**: Limit save frequency
- **Image Uploads**: Restrict upload rate
- **API Calls**: General rate limiting

---

## Performance Optimization

### Frontend Performance
- **Lazy Loading**: Load editor components on demand
- **Debounced Updates**: Reduce API calls during typing
- **Optimistic Updates**: Immediate UI feedback

### Backend Performance
- **Caching**: Cache frequently accessed content
- **Database Indexing**: Optimize queries
- **CDN Integration**: Fast image delivery

---

## Testing Strategy

### Unit Tests
- **Component Testing**: Individual editor components
- **Service Testing**: Content management services
- **Validation Testing**: Input validation functions

### Integration Tests
- **API Testing**: Content CRUD operations
- **Authentication Testing**: Access control
- **Payment Integration**: Ensure editing access after payment

### User Testing
- **Usability Testing**: Editor interface usability
- **Performance Testing**: Large content handling
- **Mobile Testing**: Mobile editing experience

---

## Deployment Plan

### Phase 1 Deployment
1. **Database Migration**: Add content fields to existing documents
2. **API Deployment**: Deploy content management endpoints
3. **Frontend Deployment**: Deploy dashboard and basic editor

### Phase 2 Deployment
1. **Style System**: Deploy customization features
2. **Image System**: Deploy image management
3. **Analytics**: Deploy tracking system

### Rollback Strategy
- **Database Backups**: Automatic content backups
- **Feature Flags**: Gradual feature rollout
- **Monitoring**: Real-time error tracking

---

## Success Metrics

### User Engagement
- **Editor Usage**: Percentage of trainers using editor
- **Content Updates**: Frequency of content changes
- **Session Duration**: Time spent in editor

### Business Impact
- **Customer Satisfaction**: Trainer feedback scores
- **Retention Rate**: Trainer subscription retention
- **Feature Adoption**: New feature usage rates

### Technical Metrics
- **Performance**: Editor loading times
- **Reliability**: Save success rates
- **Error Rates**: Editor error frequency

---

## Future Enhancements

### Advanced Features
- **A/B Testing**: Test different content versions
- **Template Library**: Pre-built content templates
- **Collaboration**: Multi-user editing support

### Integration Opportunities
- **Calendar Integration**: Booking system integration
- **Payment Processing**: Direct payment collection
- **Email Marketing**: Newsletter integration

### Scalability Improvements
- **Multi-language**: International trainer support
- **White-label**: Custom branding options
- **API Access**: Third-party integrations

---

This comprehensive plan provides a roadmap for implementing a full-featured content management system for trainer websites, transforming the current basic generation tool into a professional website management platform.
