import Link from "next/link"

import Navbar from "@/components/navbar"
import Hero from "@/components/hero"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Hero />
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2025 AlgoViz. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

