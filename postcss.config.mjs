/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {}, // Removed autoprefixer since it's not installed in package.json
  },
}

export default config
