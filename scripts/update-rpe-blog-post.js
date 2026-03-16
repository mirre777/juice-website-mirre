// Script to update the RPE blog post with new content, image, and slug
// Run with: node scripts/update-rpe-blog-post.js

const { list, put, del } = require("@vercel/blob")

async function updateRPEBlogPost() {
  console.log("=== UPDATING RPE BLOG POST ===\n")

  const newSlug = "training-smarter-with-rpe"
  const newTitle = "Training Smarter With Rpe"
  const newImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dumbbell_rackLS-Cnh89FKfdf7hDeRvjqDq8BXxyEIG0t.png" // The dumbbell rack image

  // Updated content with proper formatting
  const newContent = `---
title: ${newTitle}
date: ${new Date().toISOString().split("T")[0]}
category: Fitness
image: ${newImageUrl}
excerpt: Master the Rate of Perceived Exertion (RPE) scale to train smarter, not harder. Learn how to gauge your effort levels for optimal strength and muscle growth.
---

# ${newTitle}

Master the Rate of Perceived Exertion (RPE) scale to train smarter, not harder. Learn how to gauge your effort levels for optimal strength and muscle growth.

## Key Points

• **RPE 10** – You hit failure. No reps left.
• **RPE 9** – You had maybe 1 rep left in the tank.
• **RPE 8** – You had 2 reps left.
• **RPE 7** – About 3 reps left.
• Anything much lower than 7 usually means the set wasn't challenging enough to matter for strength or muscle growth.

## What is RPE?

Rate of Perceived Exertion (RPE) is a subjective scale used to measure the intensity of your training. It helps you understand how hard you're working without relying solely on percentages of your one-rep max.

## How to Use RPE in Your Training

The RPE scale runs from 1-10, where 10 represents maximum effort (failure) and 1 represents minimal effort. Most effective strength training happens in the RPE 7-9 range.

Training at RPE 7-8 allows for consistent progress while managing fatigue. RPE 9-10 should be used sparingly for peak intensity work.

## Benefits of RPE Training

Using RPE helps you auto-regulate your training based on how you feel each day. Some days you'll feel stronger, other days weaker – RPE accounts for these natural fluctuations.

This approach prevents overtraining while ensuring you're working hard enough to stimulate adaptation.

## Implementing RPE in Your Program

Start by learning to accurately assess your effort levels. After each set, ask yourself: "How many more reps could I have done with good form?"

Track your RPE alongside your weights and reps to build a better understanding of your training intensity over time.

## Conclusion

RPE is a powerful tool for optimizing your training intensity. By learning to gauge your effort accurately, you can train more effectively and make consistent progress toward your strength goals.`

  try {
    // First, check if there's an existing RPE post to delete
    console.log("1. Checking for existing RPE posts...")
    const { blobs } = await list({ prefix: "blog/" })

    const existingRPEBlobs = blobs.filter(
      (blob) =>
        blob.pathname.toLowerCase().includes("rpe") ||
        blob.pathname.toLowerCase().includes("training-smarter") ||
        blob.pathname.includes("1755691149845"),
    )

    if (existingRPEBlobs.length > 0) {
      console.log(`Found ${existingRPEBlobs.length} existing RPE-related posts to delete:`)
      for (const blob of existingRPEBlobs) {
        console.log(`   Deleting: ${blob.pathname}`)
        await del(blob.url)
      }
      console.log("✅ Deleted existing RPE posts")
    } else {
      console.log("No existing RPE posts found")
    }

    // Create the new blog post with clean slug
    console.log("2. Creating new RPE blog post...")
    const blobPath = `blog/${newSlug}.md`

    const { url } = await put(blobPath, newContent, {
      access: "public",
      contentType: "text/markdown",
      addRandomSuffix: false,
      allowOverwrite: true,
    })

    console.log("✅ Successfully created new RPE blog post:")
    console.log(`   Slug: ${newSlug}`)
    console.log(`   Title: ${newTitle}`)
    console.log(`   Blob URL: ${url}`)
    console.log(`   Post URL: /blog/${newSlug}`)
    console.log(`   Image: ${newImageUrl}`)
  } catch (error) {
    console.error("❌ Error updating RPE blog post:", error)
  }

  console.log("\n=== UPDATE COMPLETE ===")
}

// Run the update
updateRPEBlogPost().catch(console.error)
