const BlogPage = () => {
  const categories = ["All Posts", "Fitness", "Technology", "Coaching", "Nutrition", "Marketing"]

  return (
    <div>
      <h1>Blog Categories</h1>
      <ul>
        {categories.map((category, index) => (
          <li key={index}>{category}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogPage
