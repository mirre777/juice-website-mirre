import { ClipboardList, Video, Sparkles } from "lucide-react"

// Image URLs
export const HOMEPAGE_IMAGES = {
  laptop: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Hero%20-%20Macbook%20Pro.svg",
  phone: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/hero-section-iphone",
  getMoreClients:
    "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Screenshot-MacBook%20Pro%20%2816inch%29.png",
  keepClientsEngaged: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Blue%201.png",
  cutAdminTime:
    "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Client%20stats%20-%20Macbook%20Pro.svg",
} as const

// Trainer profiles for hero section
export const trainerProfiles = [
  {
    name: "Kate",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/gym_outside_kate.png",
  },
  {
    name: "Jackie",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/jackie%20copy.png",
  },
  {
    name: "Max",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/max88.png",
  },
  {
    name: "Jonne",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/jonne%20trainer.png",
  },
]

// Trainer testimonials
export const trainerTestimonials = [
  {
    headline: "it used to take me 3h to create a program",
    quote: "I love being able to change an exercise in the entire program with just a click. And add my own video links! ❤️ It only takes me about 20m to create a new program now.",
    name: "Jonas Ericsson",
    title: "Strongman Competitor & Coach",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/jonas%20ericsson.jpg",
    rating: 5,
  },
  {
    headline: "finally seeing the details for each exercise",
    quote: "For any exercise, I can see quickly how much they've progressed but also deep dive into the raw data to see the real numbers. Nothing better than that.",
    name: "Jonne de Bruijn",
    title: "Powerlifting Coach",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/jonne%20trainer.png",
    rating: 5,
  },
  {
    headline: "I know precisely how my clients are doing",
    quote: "As a coach you get a great overview over your clients! The communication improved between my clients a lot since I know precisely how they are doing.",
    name: "Alex Fliger",
    title: "Health & Strength Coach",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Screenshot%202025-12-14%20at%2017.31.17.png",
    rating: 5,
  },
]

// Client testimonials
export const clientTestimonials = [
  {
    quote: "Too be honest, I don't miss the Google Sheets one bit. Working with them on mobile, in the middle of the gym, was a nightmare. Especially with shaky hands from my last set :)",
    name: "Sara Grünberg",
    location: "Berlin, Germany",
    title: "Client",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/trainer%20showing%20a%20client%20something.png",
    rating: 5,
  },
  {
    quote: "I was searching for the right trainer for a while, then I stumbled on the trainer listings and discovered Marian. It's been great working with her.",
    name: "Marcus Jonuis",
    location: "London, United Kingdom",
    title: "Client",
    imageUrl:
      "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Juice_Fitness_two_people_talking_to_each_other_at_the_gym_blu_ea5b76bc-01e6-4498-87f5-1cfe18622f49_1.png",
    rating: 5,
  },
  {
    quote: "My trainer didn't want to use a personal trainer app, because he works with complex, periodised programs. A friend recommended Juice Fitness and it's working great, I get everything right into the app.",
    name: "Maartje Verbeek",
    location: "Amsterdam, Netherlands",
    title: "Client",
    imageUrl: "https://rhyfig0wjvgmsqpt.public.blob.vercel-storage.com/website-images/Screenshot%202025-12-14%20at%2015.17.32.png",
    rating: 5,
  },
]

// Statistics
export const statistics = [
  { number: "10+", label: "Built with Elite Trainers" },
  { number: "Free", label: "For the First 3 Clients" },
  { number: "100%", label: "Flexibility" },
  { number: "24/7", label: "Founder-led support" },
]

// How it works steps
export const steps = [
  {
    number: 1,
    title: "Create your trainer page",
    description: "Build a clean page in minutes. Share your link and show up in your city's directory.",
  },
  {
    number: 2,
    title: "Share with clients",
    description: "Invite clients with a link. Upload your program and send it straight to their app.",
  },
  {
    number: 3,
    title: "Track progress",
    description: "See adherence, PRs, and session data at a glance. Update plans in seconds.",
  },
]

// Everything you need features
export const features = [
  {
    number: 1,
    headline: "Get More Clients",
    subtitle: "Instant, SEO-optimized website and city listing",
    description:
      "Launch a high-performing personal site in minutes and automatically appear in your city's trainer directory so local clients can find you faster.",
    ctaText: "Create Your Page",
    ctaLink: "/marketplace/personal-trainer-website",
    imageUrl: HOMEPAGE_IMAGES.getMoreClients,
  },
  {
    number: 2,
    headline: "Keep Clients Engaged",
    subtitle: "Your programs, transformed into a premium mobile experience",
    description:
      "Turn any plan into a modern workout app that tracks PRs automatically, highlights progress, and lets you react to client workouts → better guidance, stronger engagement, and higher client retention.",
    ctaText: "View Mobile App",
    ctaLink: "/clients",
    imageUrl: HOMEPAGE_IMAGES.keepClientsEngaged,
  },
  {
    number: 3,
    headline: "Cut Admin Time",
    subtitle: "Automated client insight and zero manual reporting",
    description:
      "Juice handles tracking, analytics, check-ins, and updates → so you can focus on coaching, not spreadsheets, messages, or weekly summaries.",
    ctaText: "See Demo Video",
    ctaLink: "/demo",
    imageUrl: HOMEPAGE_IMAGES.cutAdminTime,
  },
]

// Mobile app features
export const mobileAppFeatures = [
  {
    icon: <ClipboardList className="w-6 h-6 text-black" />,
    title: "See workouts → log sets fast",
    description: "Clean workout screens, simple logging, automatic progress tracking",
  },
  {
    icon: <Video className="w-6 h-6 text-black" />,
    title: "Use your own exercise videos",
    description: "Add your preferred demos and cues (or use built-in videos)",
  },
  {
    icon: <Sparkles className="w-6 h-6 text-black" />,
    title: "Celebrate client wins",
    description: "Send a quick 🔥💪🎉 and clients feel seen, no message needed.",
  },
]

// FAQs
export const faqs = [
  {
    question: "How much does Juice cost, and how many clients can I train on the platform?",
    answer:
      "You can start free with up to 3 clients. After that, pricing scales in simple tiers based on how many clients you coach. See plans & limits here →",
  },
  {
    question: "Do my clients need to download an app to access their workouts?",
    answer:
      "Yes, clients use the free Juice mobile app as their workout tracker to see workouts, log sets, and follow progress. As they train, you automatically get their workout data and analytics inside Juice.",
  },
  {
    question: "Do I need to recreate all my workout programs from scratch?",
    answer:
      "No rebuild needed. Paste a Google Sheets link and Juice converts your existing program into a client-ready workout experience you can send to the app.",
  },
  {
    question: "Why should I use Juice instead of managing workouts with spreadsheets?",
    answer:
      "Spreadsheets are fine for writing plans, but they're bad for execution. Juice turns your program into an app your clients actually use: easy logging, PR tracking, and automatic workout stats. You spend less time chasing updates and more time coaching.",
  },
  {
    question: "How does Juice help keep my clients engaged between training sessions?",
    answer:
      "Clients stay engaged because the app makes training feel rewarding: PRs, progress stats, and clean logging. And you can keep the momentum going with quick emoji reactions: high-touch coaching without the overhead.",
  },
]

