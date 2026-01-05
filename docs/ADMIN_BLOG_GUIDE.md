# Admin Blog Management System

Complete guide for managing blog posts and interviews on the Juice Fitness website.

## Table of Contents

1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [User Guide](#user-guide)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Overview

The Admin Blog Management System allows administrators to manage blog posts and interviews through a web interface at `/admin/blog`. The system supports both hardcoded blog posts (stored in the codebase) and dynamic posts/interviews (stored in Vercel Blob storage).

### Key Features

- **Manage Blog Posts & Interviews**: Support for both blog posts and trainer interviews
- **Upload & Link Images**: Upload images to blob storage with automatic compression and link them to specific content
- **Edit Content Metadata**: Change categories, dates, titles, slugs, and other frontmatter fields
- **Edit Content**: Full markdown editor for post/interview body text
- **Delete Content**: Remove dynamic posts and interviews from blob storage
- **View Content**: Preview live blog posts and interviews
- **Markdown Shortcuts**: Quick reference guide for markdown formatting
- **Tabbed Interface**: Organize content by type (All/Blog Posts/Interviews)

---

## Technical Architecture

### System Components

#### 1. Frontend (`app/admin/blog/page.tsx`)
- Client-side React component with password-based authentication
- Fetches and displays all blog posts and interviews
- Tabbed interface for organizing content by type
- Client-side interactions for editing metadata and content
- Image upload interface with drag-and-drop support
- Real-time updates using React state management
- Inline editing for titles and slugs

#### 2. API Routes

**`/api/admin/blog/blogs` (GET, PATCH, DELETE)**
- `GET`: Fetches all blog posts from both hardcoded samples and blob storage
- `PATCH`: Updates post metadata (category, date, title, image, slug)
- `DELETE`: Removes posts from blob storage

**`/api/admin/blog/blogs/content` (GET, PATCH)**
- `GET`: Fetches full markdown content for editing
- `PATCH`: Updates the full markdown content of a blog post
- Handles frontmatter and body text updates

**`/api/admin/blog/interviews` (GET, PATCH, DELETE)**
- `GET`: Fetches all interviews from blob storage
- `PATCH`: Updates interview metadata (category, date, title, image, slug, trainerName)
- `DELETE`: Removes interviews from blob storage

**`/api/admin/blog/interviews/content` (GET, PATCH)**
- `GET`: Fetches full markdown content for editing
- `PATCH`: Updates the full markdown content of an interview
- Handles frontmatter and body text updates

**`/api/admin/blog-images` (POST)**
- Uploads images to Vercel Blob storage
- Automatically compresses images using Sharp
- Converts images to WebP format
- Resizes images to max 1920x1080 while maintaining aspect ratio
- Returns blob URL for use in blog posts and interviews

#### 3. Data Storage

**Hardcoded Posts**
- Located in `lib/blog.ts` file
- Defined as `SAMPLE_POSTS` array (metadata) and `SAMPLE_BLOG_CONTENT` object (markdown)
- Read-only from admin interface
- Require code changes to modify

**Dynamic Posts (Blob Storage)**
- Stored in Vercel Blob as `.md` files
- Fully editable through admin interface
- Path format: `blog/{slug}.md`

**Interviews (Blob Storage)**
- Stored in Vercel Blob as `.md` files
- Fully editable through admin interface
- Path format: `interviews/{slug}.md`
- Include `trainerName` field in frontmatter

**Images (Blob Storage)**
- Stored in Vercel Blob
- Path format: `blog-images/{filename}.webp`
- Automatically compressed and converted to WebP format

#### 4. Content Structure

Each blog post or interview is a markdown file with YAML frontmatter:

**Blog Post Frontmatter:**
\`\`\`markdown
---
title: "Post Title"
date: "2025-10-01"
excerpt: "Brief description of the post"
category: "Category Name"
image: "https://blob-url/image.jpg"
slug: "post-slug"
---

# Post Content

Markdown body text goes here...
\`\`\`

**Interview Frontmatter:**
\`\`\`markdown
---
title: "Interview Title"
date: "2025-10-01"
excerpt: "Brief description of the interview"
category: "Interview"
image: "https://blob-url/image.jpg"
slug: "interview-slug"
trainerName: "Trainer Name"
---

# Interview Content

Markdown body text goes here...
\`\`\`

### Data Flow

#### Reading Content
1. Admin page loads → Client component fetches content
2. API routes `/api/admin/blog/blogs` (GET) and `/api/admin/blog/interviews` (GET) are called
3. Fetches hardcoded posts from `lib/blog.ts`
4. Fetches dynamic posts from Vercel Blob (`blog/` prefix)
5. Fetches interviews from Vercel Blob (`interviews/` prefix)
6. Combines and returns all content with metadata

#### Updating Metadata
1. User clicks category/date/title/slug → Opens editor
2. User selects new value or edits inline → Triggers PATCH request
3. API route `/api/admin/blog/blogs` or `/api/admin/blog/interviews` (PATCH) receives update
4. Fetches current markdown from blob
5. Parses frontmatter and updates specific field
6. Writes updated markdown back to blob
7. Revalidates Next.js cache for affected routes
8. Returns success response

#### Updating Content
1. User clicks "Edit" button → Opens markdown editor
2. API route `/api/admin/blog/blogs/content` or `/api/admin/blog/interviews/content` (GET) fetches full content
3. User edits content → Clicks "Save Changes"
4. API route (PATCH) receives full markdown
5. Writes entire markdown file to blob storage
6. Revalidates Next.js cache
7. Returns success response

#### Uploading Images
1. User selects image file → Drag-and-drop or file picker
2. Client validates file (size, type)
3. API route `/api/admin/blog-images` (POST) receives file
4. Sharp library compresses and converts image to WebP
5. Resizes to max 1920x1080 (maintains aspect ratio)
6. Uploads compressed image to Vercel Blob storage (`blog-images/` prefix)
7. Returns blob URL
8. User can link image to specific blog post or interview

---

## User Guide

### Accessing the Admin Page

1. Navigate to `/admin/blog` in your browser
2. Enter the password when prompted (password: "Arnold")
3. The page displays:
   - Image upload section at the top
   - Statistics (Total Content, Blog Posts, Interviews, Dynamic Content)
   - Tabbed interface (All Content / Blog Posts / Interviews)
   - List of all content with metadata and actions

### Understanding Content Types

**Dynamic Posts/Interviews** (Blue "Dynamic" badge)
- Stored in Vercel Blob storage
- Fully editable (metadata and content)
- Can be deleted
- Created through admin interface or API
- Blog posts accessible at `/blog/{slug}`
- Interviews accessible at `/interview/{slug}`

**Hardcoded Posts** (Gray "Hardcoded" badge)
- Stored in codebase (`lib/blog.ts`)
- Read-only from admin interface
- Cannot be deleted through admin
- Require code deployment to modify
- Only blog posts can be hardcoded (no hardcoded interviews)

**Content Type Badges**
- "Blog Post" or "Interview" badge indicates the content type
- Helps distinguish between blog articles and trainer interviews

### Uploading Images

1. Scroll to "Upload & Link Images" section at the top
2. Optionally select content to link image to from "Link to Content (Optional)" dropdown
3. Click "Choose File" or drag and drop an image
4. Supported formats: JPG, PNG, WebP
5. Maximum size: 10MB (will be compressed automatically)
6. Optionally check "Preserve original filename"
7. Click "Upload Image"
8. Image is automatically:
   - Compressed using Sharp
   - Converted to WebP format
   - Resized to max 1920x1080 (maintains aspect ratio)
   - Uploaded to blob storage at `blog-images/{filename}.webp`
9. Copy the returned URL to use in blog posts or interviews

#### Linking Images to Content

1. Before or after uploading, find "Link to Content (Optional)" dropdown
2. Select a blog post or interview from the list (format: `[Blog] Title` or `[Interview] Title`)
3. Upload the image
4. The image URL is automatically added to the content's frontmatter
5. The image will appear as the content's featured image

### Editing Categories

1. Find the post in the list
2. Click on the category badge (e.g., "Technology", "Fitness")
3. A dropdown menu appears with available categories
4. Select a new category
5. The post updates immediately
6. The new category appears in the badge

**Available Categories:**
- Interview
- Science
- Training
- Nutrition
- Advice
- Categories are dynamically generated from existing posts
- New categories appear in dropdown when used in posts

### Editing Dates

1. Find the post in the list
2. Click on the date (e.g., "2025-10-01")
3. A calendar picker appears
4. Select a new date
5. The post updates immediately
6. The new date appears next to the calendar icon

**Note:** Only dynamic (blob) posts and interviews can have their dates edited.

### Editing Titles

1. Find the post or interview in the list
2. Click on the title
3. Edit the title inline
4. Press Enter or click outside to save
5. The title updates immediately

**Note:** Only dynamic (blob) content can have titles edited.

### Editing Slugs

1. Find the post or interview in the list
2. Click on the slug (shown below the title)
3. Edit the slug inline
4. Press Enter or click outside to save
5. A warning dialog appears about breaking existing links
6. Confirm the slug change
7. The slug updates and the file is renamed in blob storage

**Warning:** Changing slugs will break existing links. Only change if you haven't shared the content publicly yet.

**Note:** Only dynamic (blob) content can have slugs edited.

### Editing Content

1. Find the post or interview in the list
2. Click the "Edit" button (only available for dynamic content)
3. A large textarea appears with the full markdown content
4. Edit the frontmatter (between `---` lines) and/or body text
5. Use standard markdown formatting (see shortcuts below)
6. Click "Save Changes" when done
7. Click "Cancel" to discard changes
8. The content updates immediately (may need to refresh the live page to see changes)

**Note:** Only dynamic (blob) content can be edited. Hardcoded posts require code changes.

#### Markdown Formatting Shortcuts

Click the floating "?" button in the bottom-right corner to see a quick reference:

- **Headings**: `# H1`, `## H2`, `### H3`
- **Bold**: `**bold text**`
- **Italic**: `*italic text*`
- **Links**: `[link text](url)`
- **Images**: `![alt text](image-url)`
- **Lists**: `- item` or `1. item`
- **Code**: `` `inline code` `` or ` ```language ` for blocks
- **Quotes**: `> quote text`

### Deleting Content

1. Find the post or interview in the list
2. Click the red trash icon button (only available for dynamic content)
3. Confirm the deletion
4. The content is permanently removed from blob storage

**Warning:** Deletion is permanent and cannot be undone. Only dynamic (blob) content can be deleted.

### Viewing Content

Click the "View" button (eye icon) to open the live content in a new tab:
- Blog posts open at `/blog/{slug}`
- Interviews open at `/interview/{slug}`

---

## Best Practices

### Content Management
- **Use descriptive titles:** Clear, SEO-friendly titles
- **Write compelling excerpts:** 1-2 sentences that summarize the post
- **Choose appropriate categories:** Helps with organization and filtering
- **Update dates when editing:** Reflects when content was last modified

### Image Management
- **Optimize images before upload:** Compress large images
- **Use descriptive filenames:** Helps with organization
- **Link images to posts:** Keeps assets organized
- **Use alt text in markdown:** Improves accessibility and SEO

### Markdown Best Practices
- **Use proper heading hierarchy:** Start with H1, then H2, H3, etc.
- **Break up long paragraphs:** Improves readability
- **Use lists for multiple items:** Easier to scan
- **Add links to external resources:** Provides value to readers
- **Preview before saving:** Check formatting is correct

### SEO Optimization
- **Include keywords in title and excerpt:** Improves search visibility
- **Use descriptive headings:** Helps search engines understand content
- **Add internal links:** Links to other blog posts or pages
- **Keep URLs clean:** Use descriptive slugs (handled automatically)

---

## Troubleshooting

### Changes Not Appearing
- **Refresh the page:** Browser cache may show old content
- **Check the live blog:** Navigate to `/blog/{slug}` to verify
- **Verify save confirmation:** Look for success messages

### Image Upload Fails
- **Check file size:** Must be under 10MB (will be compressed automatically)
- **Check file format:** Must be JPG, PNG, or WebP (GIF not supported)
- **Check internet connection:** Upload requires stable connection
- **Note:** Images are automatically compressed and converted to WebP format

### Cannot Edit Post
- **Check post type:** Only "Dynamic" posts can be edited
- **Hardcoded posts:** These are read-only and must be edited in the codebase

### Category Not Showing
- **Available categories:** Interview, Science, Training, Nutrition, Advice
- **Dynamic categories:** Categories are generated from existing posts
- **Create content with new category:** It will appear in the dropdown for future edits

---

## Technical Notes

### Environment Variables
- `BLOB_READ_WRITE_TOKEN`: Required for blob storage operations
- `NEXT_PUBLIC_APP_URL`: Base URL for sitemap and links

### Caching
- Blog posts are fetched fresh on each admin page load
- Live blog pages may be cached by Next.js
- Use "Refresh Data" button to force reload

### Security
- Admin page uses password-based authentication (password: "Arnold")
- Authentication is implemented in the client component
- Blob storage uses secure tokens (`BLOB_READ_WRITE_TOKEN`)
- API routes validate request data
- Calendly widget hidden on admin pages

### Performance
- Images stored in Vercel Blob (CDN-backed)
- Images automatically compressed using Sharp library
- Images converted to WebP format for optimal file size
- Markdown parsing happens server-side
- Client-side updates use optimistic UI patterns
- Next.js cache revalidation after content updates

---

## Future Enhancements

Potential features to add:
- Enhanced authentication/authorization system (currently uses simple password)
- Rich text editor (WYSIWYG) option
- Image gallery/media library
- Bulk operations (delete multiple, update categories)
- Content scheduling (publish at specific time)
- Draft/published status
- Content analytics (views, engagement)
- Search and filter content
- Tag system (in addition to categories)
- SEO preview (title, description, social cards)
- Export content functionality

---

## Support

For technical issues or feature requests, contact the development team or create an issue in the repository.
