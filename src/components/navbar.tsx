import React from 'react'
import Link from 'next/link'
const Navbar = () => {
  return (
    <div>
      <div>
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <span className="font-bold text-xl">AlgoViz</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/tree-traversal" className="text-sm font-medium hover:underline underline-offset-4">
            Tree Traversal
          </Link>
          <Link href="/truth-table" className="text-sm font-medium hover:underline underline-offset-4">
            Truth Table
          </Link>
        </nav>
      </header>
      </div>
    </div>
  )
}

export default Navbar
