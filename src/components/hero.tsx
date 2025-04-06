import React from 'react'
import { ArrowRight, GitBranchPlus, Table2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"


const Hero = () => {
  return (
    <div>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Interactive Algorithm Visualization
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Explore and understand algorithms through interactive visualizations. Perfect for students, educators,
                  and programming enthusiasts.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="#features">
                    Explore Features <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-accent">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Features</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose from our interactive visualization tools to enhance your understanding of algorithms and logic.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 max-w-5xl">
                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <GitBranchPlus className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Tree Traversal Visualizer</CardTitle>
                    <CardDescription>
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
                    <Button asChild className="w-full">
                      <Link href="/tree-traversal">
                        Try Tree Traversal <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="flex flex-col h-full">
                  <CardHeader>
                    <Table2 className="h-10 w-10 mb-2 text-primary" />
                    <CardTitle>Truth Table Generator</CardTitle>
                    <CardDescription>
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
                    <Button asChild className="w-full">
                      <Link href="/truth-table">
                        Try Truth Table Generator <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Hero
