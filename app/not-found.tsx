"use client"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { motion } from "framer-motion"

export default function NotFound() {
  const { isCoach } = useTheme()

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated GIF Background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PIy2rtfcqfJjPSHTiCIlnGUs6PxJsX.png')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* Overlay to ensure text readability */}
        <div className={`absolute inset-0 ${isCoach ? "bg-white/80" : "bg-black/70"}`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <Navbar />

        <div className="container px-4 md:px-6 pt-32 pb-20 flex flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span
              className={`inline-block px-4 py-2 rounded-full ${isCoach ? "bg-black text-white" : "bg-juice text-black"} font-medium text-sm`}
            >
              404 ERROR
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 ${isCoach ? "text-black" : "text-white"}`}
          >
            This is not the page you're looking for.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`text-xl max-w-2xl mb-10 ${isCoach ? "text-gray-800" : "text-zinc-200"}`}
          >
            We can't find that page, but you can always head back to the home page or contact our support team if you
            need assistance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/" passHref>
              <Button size="lg" className="bg-juice text-juice-foreground hover:bg-juice/90 text-lg px-8">
                Go back to homepage
              </Button>
            </Link>
            <Link href="/contact" passHref>
              <Button
                size="lg"
                variant="outline"
                className={`${isCoach ? "border-gray-400 bg-white/30 hover:bg-white/50" : "border-zinc-700 bg-black/30 hover:bg-black/50"} text-lg px-8`}
              >
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
