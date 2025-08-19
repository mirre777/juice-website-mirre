# Landing Pages Structure Guide

## 📁 **Current File Structure**

All landing pages are organized using Next.js route groups for clean file organization while preserving original URLs:

\`\`\`
/app
  /(landing-pages)
    /(client)
      /download-juice-app
        page.tsx
        DownloadJuiceAppClientPage.tsx
      /findatrainer
        page.tsx
        FindATrainerClientPage.tsx
      /gratis-fitness-app-danmark
        page.tsx
        GratisFitnessAppClientPage.tsx
      /gratis-workout-app-met-trainer
        page.tsx
        GratisWorkoutAppClientPage.tsx
      /best-free-workout-app-uk
        page.tsx
        BestFreeWorkoutAppClientPage.tsx
      /trainingsplan-app-gratis
        page.tsx
        TrainingsplanAppClientPage.tsx
      /personal-training-amsterdam
        page.tsx
      /personal-training-berlin
        page.tsx
      /personal-training-koebenhavn
        page.tsx
      /personal-training-muenchen
        page.tsx
      /personal-training-wien
        page.tsx
    /(trainers)
      /getclients
        page.tsx
        GetClientsClientPage.tsx
\`\`\`

## 🎯 **Route Groups Explained**

- **Parentheses folders** like `(landing-pages)` and `(client)` are route groups
- **Route groups organize files without affecting URLs**
- URLs remain unchanged: `/download-juice-app`, `/findatrainer`, `/getclients`, etc.
- **Benefits**: Clean organization, logical grouping, no breaking changes

## 📋 **Rules for Creating New Landing Pages**

### **1. File Location**
- **Client-focused pages**: Place in `/app/(landing-pages)/(client)/[page-name]/`
- **Trainer-focused pages**: Place in `/app/(landing-pages)/(trainers)/[page-name]/`

### **2. Required Files**
Every landing page folder must contain:
- `page.tsx` - Next.js page component with metadata
- `[PageName]ClientPage.tsx` - Main client component (optional for simple pages)

### **3. File Naming Conventions**
- **Folder names**: Use kebab-case (`download-juice-app`, `personal-training-berlin`)
- **Client components**: PascalCase with "ClientPage" suffix (`DownloadJuiceAppClientPage.tsx`)
- **URLs**: Automatically match folder names (`/download-juice-app`)

### **4. SEO Requirements**
Every `page.tsx` must include:
- **Title**: Descriptive page title
- **Description**: Meta description (150-160 characters)
- **Canonical URL**: Absolute URL for SEO
- **OpenGraph**: Social media sharing metadata

## 📝 **Templates**

### **Basic Landing Page Template**

\`\`\`tsx
// app/(landing-pages)/(client)/[page-name]/page.tsx
import { Metadata } from 'next'
import { PageNameClientPage } from './PageNameClientPage'

export const metadata: Metadata = {
  title: 'Your Page Title - Juice Fitness',
  description: 'Your compelling meta description here (150-160 characters)',
  alternates: {
    canonical: '/your-page-url',
  },
  openGraph: {
    title: 'Your Page Title - Juice Fitness',
    description: 'Your compelling meta description here',
    url: '/your-page-url',
    siteName: 'Juice Fitness',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Your page description',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
}

export default function PageName() {
  return <PageNameClientPage />
}
\`\`\`

### **Client Component Template**

\`\`\`tsx
// app/(landing-pages)/(client)/[page-name]/PageNameClientPage.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function PageNameClientPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Your Compelling Headline
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your value proposition and key benefits description.
          </p>
          <Button size="lg" className="mb-16">
            Primary Call to Action
          </Button>
        </div>
        
        {/* Add your page content here */}
      </div>
    </main>
  )
}
\`\`\`

### **Simple Page Template (No Client Component)**

\`\`\`tsx
// app/(landing-pages)/(client)/[page-name]/page.tsx
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Your Page Title - Juice Fitness',
  description: 'Your compelling meta description here',
  alternates: {
    canonical: '/your-page-url',
  },
  openGraph: {
    title: 'Your Page Title - Juice Fitness',
    description: 'Your compelling meta description here',
    url: '/your-page-url',
    siteName: 'Juice Fitness',
    type: 'website',
  },
}

export default function PageName() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-8">
          Your Page Title
        </h1>
        {/* Add your content here */}
      </div>
    </main>
  )
}
\`\`\`

## ✅ **Checklist for New Landing Pages**

### **Before Creating:**
- [ ] Determine if page is client-focused or trainer-focused
- [ ] Choose appropriate kebab-case folder name
- [ ] Plan page content and call-to-action

### **During Creation:**
- [ ] Create folder in correct route group location
- [ ] Add `page.tsx` with complete metadata
- [ ] Add client component if needed
- [ ] Include proper SEO metadata (title, description, canonical, OpenGraph)
- [ ] Use consistent styling with existing pages
- [ ] Test page locally

### **After Creation:**
- [ ] Verify URL works correctly
- [ ] Check SEO metadata in browser dev tools
- [ ] Test mobile responsiveness
- [ ] Validate HTML and accessibility
- [ ] Add to sitemap if needed

## 🚨 **Important Notes**

### **DO:**
- ✅ Use route groups for organization
- ✅ Follow kebab-case naming for folders
- ✅ Include complete SEO metadata
- ✅ Use absolute imports (`@/components`)
- ✅ Test pages thoroughly before deployment

### **DON'T:**
- ❌ Create pages outside the route groups structure
- ❌ Skip SEO metadata requirements
- ❌ Use relative imports for components
- ❌ Forget to test mobile responsiveness
- ❌ Create pages without proper planning

## 📊 **Current Landing Pages Inventory**

### **Client Pages (11 total):**
1. `/download-juice-app` - Main app download page
2. `/findatrainer` - Trainer discovery page
3. `/gratis-fitness-app-danmark` - Danish fitness app page
4. `/gratis-workout-app-met-trainer` - Dutch workout app page
5. `/best-free-workout-app-uk` - UK fitness app page
6. `/trainingsplan-app-gratis` - German training plan page
7. `/personal-training-amsterdam` - Amsterdam personal training
8. `/personal-training-berlin` - Berlin personal training
9. `/personal-training-koebenhavn` - Copenhagen personal training
10. `/personal-training-muenchen` - Munich personal training
11. `/personal-training-wien` - Vienna personal training

### **Trainer Pages (1 total):**
1. `/getclients` - Trainer client acquisition page

## 🔧 **Maintenance**

### **Adding New Pages:**
1. Follow the templates above
2. Use the checklist for quality assurance
3. Test thoroughly before deployment

### **Updating Existing Pages:**
1. Maintain the current file structure
2. Update SEO metadata when content changes
3. Keep URLs consistent (avoid breaking changes)

### **File Organization:**
- Keep route groups structure intact
- Don't move files outside the organized structure
- Maintain consistent naming conventions

---

**Last Updated:** Post-migration (all pages successfully organized)
**Structure Status:** ✅ Complete and functional
**URL Preservation:** ✅ All original URLs maintained
