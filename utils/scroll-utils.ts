export function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId)
  if (section) {
    // Get the height of the fixed header
    const headerHeight = 80 // Increased to account for the floating header (top-4 + padding)

    // Calculate the position to scroll to (element position - header height)
    const offsetPosition = section.offsetTop - headerHeight

    // Scroll to that position with smooth behavior
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}
