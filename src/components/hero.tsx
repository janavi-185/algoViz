"use client"

import React from 'react'
import { ArrowRight, GitBranchPlus, Table2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

const Hero = () => {
  return (
    <main className="flex-1">
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <motion.div variants={item} className="space-y-4">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                Interactive Algorithm Visualization
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed italic">
                Explore and understand algorithms through interactive visualizations. Perfect for students, educators,
                and programming enthusiasts.
              </p>
            </motion.div>
            <motion.div variants={item} className="space-x-4 pt-4">
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300">
                <Link href="#features">
                  Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose from our interactive visualization tools to enhance your understanding of algorithms and logic.
              </p>
            </motion.div>
          </div>

          <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 max-w-5xl mx-auto"
          >
            <motion.div variants={item}>
              <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 w-fit rounded-lg bg-primary/10 mb-2">
                    <GitBranchPlus className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Tree Traversal Visualizer</CardTitle>
                  <CardDescription className="text-base">
                    Visualize different tree traversal algorithms including in-order, pre-order, and post-order
                    traversals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    Create custom binary trees and watch how different traversal algorithms navigate through the
                    nodes. Perfect for understanding tree data structures.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full rounded-md group">
                    <Link href="/tree-traversal">
                      Try Tree Traversal <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="flex flex-col h-full border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader>
                  <div className="p-3 w-fit rounded-lg bg-primary/10 mb-2">
                    <Table2 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Truth Table Generator</CardTitle>
                  <CardDescription className="text-base">
                    Generate truth tables for logical expressions and boolean algebra formulas.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-muted-foreground">
                    Enter logical expressions using operators like AND, OR, NOT, and more. Instantly see the complete
                    truth table with all possible combinations.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="secondary" className="w-full rounded-md group">
                    <Link href="/truth-table">
                      Try Truth Table Generator <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}

export default Hero
