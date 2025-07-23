"use client"

import type { Variants, Transition } from "framer-motion"

// Transition presets
export const transitions = {
  // Smooth spring animation with bounce
  springBounce: {
    type: "spring",
    stiffness: 260,
    damping: 20,
    duration: 0.6,
  } as Transition,

  // Quick spring with less bounce
  springQuick: {
    type: "spring",
    stiffness: 400,
    damping: 30,
    duration: 0.4,
  } as Transition,

  // Gentle easing animation
  easeInOut: {
    type: "tween",
    ease: "easeInOut",
    duration: 0.5,
  } as Transition,

  // Slow, smooth animation
  gentle: {
    type: "tween",
    ease: [0.25, 0.1, 0.25, 1],
    duration: 0.7,
  } as Transition,

  // Quick pop animation
  pop: {
    type: "spring",
    stiffness: 500,
    damping: 25,
    duration: 0.3,
  } as Transition,
}

// Success animations
export const successAnimations = {
  // Check mark circle animation (the one we used in the waitlist form)
  checkCircle: {
    container: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: transitions.springBounce,
    },
    icon: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { delay: 0.2, duration: 0.4 },
    },
    text: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { delay: 0.3, duration: 0.4 },
    },
  },

  // Pulse animation for success
  pulse: {
    container: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.3, ease: "easeOut" },
    },
    icon: {
      initial: { scale: 0 },
      animate: { scale: 1 },
      transition: { delay: 0.2, duration: 0.3, ease: "easeOut" },
    },
    text: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { delay: 0.4, duration: 0.3, ease: "easeOut" },
    },
  },

  // Slide in from top
  slideFromTop: {
    container: {
      initial: { y: -50, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: transitions.springQuick,
    },
    icon: {
      initial: { rotate: -90, opacity: 0 },
      animate: { rotate: 0, opacity: 1 },
      transition: { delay: 0.2, duration: 0.4 },
    },
    text: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.4, duration: 0.3 },
    },
  },

  // Fade in with scale
  fadeScale: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.5 },
    },
    icon: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: transitions.pop,
    },
    text: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { delay: 0.3, duration: 0.4 },
    },
  },

  // Bounce in animation
  bounce: {
    container: {
      initial: { y: 100, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: transitions.springBounce,
    },
    icon: {
      initial: { y: -20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 15,
        delay: 0.2,
      },
    },
    text: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { delay: 0.4, duration: 0.3 },
    },
  },
}

// Button animations
export const buttonAnimations = {
  // Subtle scale on hover
  scaleHover: {
    initial: {},
    hover: { scale: 1.05 },
    tap: { scale: 0.98 },
    transition: transitions.springQuick,
  },

  // Glow effect
  glow: {
    initial: { boxShadow: "0 0 0 rgba(210, 255, 40, 0)" },
    hover: { boxShadow: "0 0 15px rgba(210, 255, 40, 0.5)" },
    tap: { boxShadow: "0 0 5px rgba(210, 255, 40, 0.3)", scale: 0.98 },
    transition: transitions.easeInOut,
  },

  // Bounce effect
  bounce: {
    initial: {},
    hover: { y: -3 },
    tap: { y: 1 },
    transition: transitions.springQuick,
  },
}

// Modal animations
export const modalAnimations = {
  // Fade in/out
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: transitions.easeInOut,
  },

  // Scale in/out
  scale: {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: transitions.springQuick,
  },

  // Slide in from bottom
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
    transition: transitions.springQuick,
  },

  // Slide in from right
  slideRight: {
    initial: { x: 50, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 50, opacity: 0 },
    transition: transitions.springQuick,
  },
}

// List item animations (for staggered children)
export const listAnimations = {
  // Container for staggered children
  container: {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: { opacity: 1 },
  },

  // Fade in from bottom for each item
  fadeUp: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Fade in from left
  fadeRight: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -20, opacity: 0 },
    transition: { duration: 0.3 },
  },

  // Scale in
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
    transition: { duration: 0.3 },
  },
}

// Page transition animations
export const pageAnimations = {
  // Fade transition
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },

  // Slide up transition
  slideUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
    transition: transitions.easeInOut,
  },

  // Slide from right
  slideFromRight: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
    transition: transitions.gentle,
  },
}

// Loading animations
export const loadingAnimations = {
  // Pulse animation
  pulse: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
    },
    transition: {
      duration: 1.5,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },

  // Bounce animation
  bounce: {
    animate: {
      y: [0, -10, 0],
    },
    transition: {
      duration: 0.6,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    },
  },

  // Spin animation
  spin: {
    animate: {
      rotate: 360,
    },
    transition: {
      duration: 1,
      repeat: Number.POSITIVE_INFINITY,
      ease: "linear",
    },
  },
}

// Helper function to create staggered animations for lists
export function createStaggeredAnimation(
  childAnimation: Variants,
  staggerDelay = 0.1,
): {
  container: Variants
  item: Variants
} {
  return {
    container: {
      initial: { opacity: 1 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: 0.1,
        },
      },
      exit: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay / 2,
          staggerDirection: -1,
        },
      },
    },
    item: childAnimation,
  }
}

// Additional animations
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
}

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6 },
}
