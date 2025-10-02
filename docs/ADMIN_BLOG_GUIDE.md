# Admin Blog Management System

Complete guide for managing blog posts on the Juice Fitness website.

## Table of Contents

1. [Overview](#overview)
2. [Technical Architecture](#technical-architecture)
3. [User Guide](#user-guide)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)

---

## Overview

The Admin Blog Management System allows administrators to manage blog posts through a web interface at `/admin/blog`. The system supports both hardcoded blog posts (stored in the codebase) and dynamic posts (stored in Vercel Blob storage).

### Key Features

- **Upload & Link Images**: Upload images to blob storage and link them to specific blog posts
- **Edit Post Metadata**: Change categories, dates, and other frontmatter fields
- **Edit Post Content**: Full markdown editor for post body text
- **Delete Posts**: Remove dynamic posts from blob storage
- **View Posts**: Preview live blog posts
- **Markdown Shortcuts**: Quick reference guide for markdown formatting

---

## Technical Architecture

### System Components

#### 1. Frontend (`app/admin/blog/page.tsx`)
- React Server Component that fetches and displays all blog posts
- Client-side interactions for editing metadata and content
- Image upload interface with drag-and-drop support
- Real-time updates using React state management

#### 2. API Routes

**`/api/admin/blog-posts` (GET, PATCH, DELETE)**
- `GET`: Fetches all blog posts from both hardcoded samples and blob storage
- `PATCH`: Updates post metadata (category, date, title, excerpt)
- `DELETE`: Removes posts from blob storage

**`/api/admin/blog-posts/content` (PATCH)**
- Updates the full markdown content of a blog post
- Handles frontmatter and body text updates

**`/api/admin/upload-image` (POST)**
- Uploads images to Vercel Blob storage
- Returns blob URL for use in blog posts

#### 3. Data Storage

**Hardcoded Posts**
- Located in `app/blog/samples/` directory
- Read-only from admin interface
- Require code changes to modify

**Dynamic Posts (Blob Storage)**
- Stored in Vercel Blob as `.md` files
- Fully editable through admin interface
- Path format: `blog-posts/{slug}.md`

#### 4. Blog Post Structure

Each blog post is a markdown file with YAML frontmatter:

\`\`\`markdown
---
title: "Post Title"
date: "2025-10-01"
excerpt: "Brief description of the post"
author: "Author Name"
category: "Category Name"
image: "/images/post-image.jpg"
---

# Post Content

Markdown body text goes here...
\`\`\`

### Data Flow

#### Reading Posts
1. Admin page loads → Server Component fetches posts
2. API route `/api/admin/blog-posts` (GET) is called
3. Fetches hardcoded posts from `app/blog/samples/`
4. Fetches dynamic posts from Vercel Blob
5. Combines and returns all posts with metadata

#### Updating Metadata
1. User clicks category/date dropdown → Opens editor
2. User selects new value → Triggers PATCH request
3. API route `/api/admin/blog-posts` (PATCH) receives update
4. Fetches current markdown from blob
5. Parses frontmatter and updates specific field
6. Writes updated markdown back to blob
7. Returns success response

#### Updating Content
1. User clicks "Edit" button → Opens markdown editor
2. User edits content → Clicks "Save Changes"
3. API route `/api/admin/blog-posts/content` (PATCH) receives full markdown
4. Writes entire markdown file to blob storage
5. Returns success response

#### Uploading Images
1. User selects image file → Drag-and-drop or file picker
2. Client validates file (size, type)
3. API route `/api/admin/upload-image` (POST) receives file
4. Uploads to Vercel Blob storage
5. Returns blob URL
6. User can link image to specific blog post

---

## User Guide

### Accessing the Admin Page

Navigate to `/admin/blog` in your browser. The page displays:
- Image upload section at the top
- Statistics (total posts, hardcoded posts, blob posts, system status)
- List of all blog posts with metadata and actions

### Understanding Post Types

**Dynamic Posts** (Blue badge)
- Stored in Vercel Blob storage
- Fully editable (metadata and content)
- Can be deleted
- Created through admin interface or API

**Hardcoded Posts** (Gray badge)
- Stored in codebase (`app/blog/samples/`)
- Read-only from admin interface
- Cannot be deleted through admin
- Require code deployment to modify

### Uploading Images

1. Scroll to "Upload & Link Images" section at the top
2. Click "Choose File" or drag and drop an image
3. Supported formats: JPG, PNG, WebP, GIF
4. Maximum size: 4.5MB
5. Optionally check "Preserve original filename"
6. Click "Upload Image"
7. Image is uploaded to blob storage
8. Copy the returned URL to use in blog posts

#### Linking Images to Posts

1. After uploading, find "Link to Blog Post (Optional)" dropdown
2. Select a blog post from the list
3. The image URL is automatically added to the post's frontmatter
4. The image will appear as the post's featured image

### Editing Categories

1. Find the post in the list
2. Click on the category badge (e.g., "Technology", "Fitness")
3. A dropdown menu appears with available categories
4. Select a new category
5. The post updates immediately
6. The new category appears in the badge

**Available Categories:**
- Fitness
- General
- Marketing
- Technology
- Science (manually added)
- Any other categories from existing posts

### Editing Dates

1. Find the post in the list
2. Click on the date (e.g., "2025-10-01")
3. A calendar picker appears
4. Select a new date
5. The post updates immediately
6. The new date appears next to the calendar icon

**Note:** Only dynamic (blob) posts can have their dates edited.

### Editing Post Content

1. Find the post in the list
2. Click the "Edit" button
3. A large textarea appears with the full markdown content
4. Edit the frontmatter (between `---` lines) and/or body text
5. Use standard markdown formatting (see shortcuts below)
6. Click "Save Changes" when done
7. Click "Cancel" to discard changes
8. Refresh the blog page to see updates

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

### Deleting Posts

1. Find the post in the list
2. Click the red trash icon button
3. Confirm the deletion
4. The post is permanently removed from blob storage

**Warning:** Deletion is permanent and cannot be undone. Only dynamic (blob) posts can be deleted.

### Viewing Posts

Click the "View" button (eye icon) to open the live blog post in a new tab.

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
- **Check file size:** Must be under 4.5MB
- **Check file format:** Must be JPG, PNG, WebP, or GIF
- **Check internet connection:** Upload requires stable connection

### Cannot Edit Post
- **Check post type:** Only "Dynamic" posts can be edited
- **Hardcoded posts:** These are read-only and must be edited in the codebase

### Category Not Showing
- **Manually added categories:** "Science" is manually included
- **Dynamic categories:** Generated from existing posts
- **Create a post with new category:** It will appear in the dropdown

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
- Admin routes should be protected with authentication
- Blob storage uses secure tokens
- API routes validate request data
- Calendly widget hidden on admin pages

### Performance
- Images stored in Vercel Blob (CDN-backed)
- Markdown parsing happens server-side
- Client-side updates use optimistic UI patterns

---

## Future Enhancements

Potential features to add:
- Authentication/authorization for admin access
- Rich text editor (WYSIWYG) option
- Image gallery/media library
- Bulk operations (delete multiple, update categories)
- Post scheduling (publish at specific time)
- Draft/published status
- Post analytics (views, engagement)
- Search and filter posts
- Tag system (in addition to categories)
- SEO preview (title, description, social cards)

---

## Support

For technical issues or feature requests, contact the development team or create an issue in the repository.
