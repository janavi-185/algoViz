"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center justify-center">
          <motion.span 
            whileHover={{ scale: 1.05 }}
            className="font-bold text-xl text-primary"
          >
            AlgoViz
          </motion.span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link href="/tree-traversal">
            <motion.span
              whileHover={{ scale: 1.05, color: "var(--primary)" }}
              className="text-sm font-medium transition-colors"
            >
              Tree Traversal
            </motion.span>
          </Link>
          <Link href="/truth-table">
            <motion.span
              whileHover={{ scale: 1.05, color: "var(--primary)" }}
              className="text-sm font-medium transition-colors"
            >
              Truth Table
            </motion.span>
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
