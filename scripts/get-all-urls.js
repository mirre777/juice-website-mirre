const { getAllPosts } = require('../lib/blog')
const { getAllInterviews } = require('../app/interview/_lib/interview-data')

async function getAllUrls() {
  try {
    const posts = await getAllPosts()
    const interviews = await getAllInterviews()

    console.log('\n=== BLOG POSTS ===\n')
    posts.forEach((post) => {
      console.log(`https://juice.fitness/blog/${post.slug}`)
    })

    console.log('\n=== INTERVIEWS ===\n')
    interviews.forEach((interview) => {
      console.log(`https://juice.fitness/interview/${interview.slug}`)
    })

    console.log(`\n\nTotal: ${posts.length} blog posts, ${interviews.length} interviews`)
  } catch (error) {
    console.error('Error fetching URLs:', error)
  }
}

getAllUrls()

