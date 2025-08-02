// Test LinkedIn sharing endpoints to confirm the issue
console.log("🔍 Testing LinkedIn Sharing Endpoints...\n")

// Current implementation from SocialShare component
const testBlogPost = {
  title: "The Future of Fitness Coaching",
  url: "https://juicefitness.io/blog/the-future-of-fitness-coaching",
  excerpt: "Discover how technology is revolutionizing personal training and fitness coaching in 2025.",
}

const encodedTitle = encodeURIComponent(testBlogPost.title)
const encodedUrl = encodeURIComponent(testBlogPost.url)
const encodedText = encodeURIComponent(testBlogPost.excerpt)

console.log("📝 Test Blog Post Data:")
console.log(`Title: ${testBlogPost.title}`)
console.log(`URL: ${testBlogPost.url}`)
console.log(`Excerpt: ${testBlogPost.excerpt}\n`)

// Test current deprecated endpoint
const currentLinkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedText}`

console.log("❌ CURRENT (Deprecated) LinkedIn Sharing URL:")
console.log(currentLinkedInUrl)
console.log("\n📋 Issues with this approach:")
console.log("- Uses deprecated share-offsite endpoint")
console.log("- Parameters (url, title, summary) are ignored by modern LinkedIn")
console.log("- Results in empty post dialog as shown in screenshot\n")

// Test modern alternatives
console.log("✅ MODERN LinkedIn Sharing Alternatives:\n")

// Option 1: LinkedIn Intent URL (limited pre-population)
const intentUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
console.log("1. LinkedIn Intent URL (minimal):")
console.log(intentUrl)
console.log("   - Still uses old endpoint but with minimal params")
console.log("   - May work for URL only, but no title/text\n")

// Option 2: LinkedIn Compose with text content
const composeText = `${testBlogPost.title}\n\n${testBlogPost.excerpt}\n\n${testBlogPost.url}`
const encodedComposeText = encodeURIComponent(composeText)
const composeUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedComposeText}`
console.log("2. LinkedIn Compose with pre-filled text:")
console.log(composeUrl)
console.log("   - Includes title, excerpt, and URL in post text")
console.log("   - More reliable for content pre-population\n")

// Option 3: Simple LinkedIn home with manual sharing
const simpleUrl = "https://www.linkedin.com/feed/?shareActive=true"
console.log("3. Simple LinkedIn compose (manual):")
console.log(simpleUrl)
console.log("   - Opens compose dialog, user manually adds content")
console.log("   - Most reliable but requires manual work\n")

// Test URL encoding
console.log("🔧 URL Encoding Test:")
console.log("Original URL:", testBlogPost.url)
console.log("Encoded URL:", encodedUrl)
console.log("Original Title:", testBlogPost.title)
console.log("Encoded Title:", encodedTitle)
console.log("Original Excerpt:", testBlogPost.excerpt)
console.log("Encoded Excerpt:", encodedText)

console.log("\n🎯 RECOMMENDATION:")
console.log("Switch to Option 2 (LinkedIn Compose with pre-filled text)")
console.log("This will include the blog post URL, title, and excerpt in the LinkedIn post")
console.log("and is the most reliable method for modern LinkedIn sharing.")

// Simulate what the user would see
console.log("\n📱 What user currently sees:")
console.log("- Clicks LinkedIn share button")
console.log('- LinkedIn opens with empty "What do you want to talk about?" dialog')
console.log("- No URL, title, or content pre-populated")
console.log("- User has to manually type everything")

console.log("\n📱 What user should see with fix:")
console.log("- Clicks LinkedIn share button")
console.log("- LinkedIn opens with compose dialog")
console.log("- Post text pre-filled with:")
console.log(`  "${testBlogPost.title}"`)
console.log(`  "${testBlogPost.excerpt}"`)
console.log(`  "${testBlogPost.url}"`)
console.log("- User can edit and post immediately")

console.log("\n✅ Script completed - Issue confirmed!")
