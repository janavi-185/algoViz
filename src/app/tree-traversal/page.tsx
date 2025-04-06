"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, RotateCcw, StepForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

// Define the TreeNode type
interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x: number
  y: number
  highlighted: boolean
}

export default function TreeTraversalPage() {
  const [inputValue, setInputValue] = useState<string>("50,30,70,20,40,60,80")
  const [rootNode, setRootNode] = useState<TreeNode | null>(null)
  const [traversalType, setTraversalType] = useState<string>("inorder")
  const [traversalSteps, setTraversalSteps] = useState<number[]>([])
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1)
  const [isAnimating, setIsAnimating] = useState<boolean>(false)
  const [animationSpeed, setAnimationSpeed] = useState<number>(1000)
  const [canvasWidth, setCanvasWidth] = useState<number>(800)
  const [canvasHeight, setCanvasHeight] = useState<number>(400)
  const [explanation, setExplanation] = useState<string>("")

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<NodeJS.Timeout | null>(null)

  // Create a binary search tree from an array of values
  const createBST = (values: number[]): TreeNode | null => {
    if (!values.length) return null

    // Sort and remove duplicates
    const sortedValues = [...new Set(values)].sort((a, b) => a - b)

    const insertNode = (arr: number[], start: number, end: number): TreeNode | null => {
      if (start > end) return null

      const mid = Math.floor((start + end) / 2)
      const node: TreeNode = {
        value: arr[mid],
        left: insertNode(arr, start, mid - 1),
        right: insertNode(arr, mid + 1, end),
        x: 0,
        y: 0,
        highlighted: false,
      }

      return node
    }

    return insertNode(sortedValues, 0, sortedValues.length - 1)
  }

  // Calculate x and y coordinates for each node
  const calculateNodePositions = (
    node: TreeNode | null,
    depth = 0,
    horizontalPosition = 0.5,
    horizontalSpacing = 0.25,
  ): void => {
    if (!node) return

    node.x = horizontalPosition * canvasWidth
    node.y = (depth + 1) * 70

    const nextSpacing = horizontalSpacing / 2

    calculateNodePositions(node.left, depth + 1, horizontalPosition - nextSpacing, nextSpacing)
    calculateNodePositions(node.right, depth + 1, horizontalPosition + nextSpacing, nextSpacing)
  }

  // Generate traversal steps
  const generateTraversalSteps = (node: TreeNode | null, type: string): number[] => {
    const steps: number[] = []

    const traverse = (currentNode: TreeNode | null) => {
      if (!currentNode) return

      if (type === "preorder") {
        steps.push(currentNode.value)
      }

      traverse(currentNode.left)

      if (type === "inorder") {
        steps.push(currentNode.value)
      }

      traverse(currentNode.right)

      if (type === "postorder") {
        steps.push(currentNode.value)
      }
    }

    traverse(node)
    return steps
  }

  // Draw the tree on canvas
  const drawTree = () => {
    const canvas = canvasRef.current
    if (!canvas || !rootNode) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw edges first
    const drawEdges = (node: TreeNode | null) => {
      if (!node) return

      if (node.left) {
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(node.left.x, node.left.y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 2
        ctx.stroke()
        drawEdges(node.left)
      }

      if (node.right) {
        ctx.beginPath()
        ctx.moveTo(node.x, node.y)
        ctx.lineTo(node.right.x, node.right.y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 2
        ctx.stroke()
        drawEdges(node.right)
      }
    }

    drawEdges(rootNode)

    // Draw nodes
    const drawNodes = (node: TreeNode | null) => {
      if (!node) return

      // Draw circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, Math.PI * 2)
      ctx.fillStyle = node.highlighted ? "#60a5fa" : "#1e293b"
      ctx.fill()
      ctx.strokeStyle = "#60a5fa"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw value
      ctx.fillStyle = "#e2e8f0"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), node.x, node.y)

      drawNodes(node.left)
      drawNodes(node.right)
    }

    drawNodes(rootNode)
  }

  // Reset highlighted nodes
  const resetHighlights = (node: TreeNode | null): void => {
    if (!node) return
    node.highlighted = false
    resetHighlights(node.left)
    resetHighlights(node.right)
  }

  // Highlight a node with a specific value
  const highlightNode = (node: TreeNode | null, value: number): void => {
    if (!node) return

    if (node.value === value) {
      node.highlighted = true
    } else {
      highlightNode(node.left, value)
      highlightNode(node.right, value)
    }
  }

  // Handle tree creation
  const handleCreateTree = () => {
    try {
      const values = inputValue.split(",").map((val) => Number.parseInt(val.trim()))
      const newRoot = createBST(values)
      setRootNode(newRoot)

      if (newRoot) {
        calculateNodePositions(newRoot)
        const steps = generateTraversalSteps(newRoot, traversalType)
        setTraversalSteps(steps)
        setCurrentStepIndex(-1)
        resetAnimation()

        // Update explanation based on traversal type
        updateExplanation()
      }
    } catch (error) {
      console.error("Error creating tree:", error)
    }
  }

  // Update explanation based on traversal type
  const updateExplanation = () => {
    switch (traversalType) {
      case "inorder":
        setExplanation(
          "In-order traversal visits left subtree, then root, then right subtree (Left → Root → Right). It visits nodes in ascending order in a BST.",
        )
        break
      case "preorder":
        setExplanation(
          "Pre-order traversal visits root, then left subtree, then right subtree (Root → Left → Right). It's useful for creating a copy of the tree.",
        )
        break
      case "postorder":
        setExplanation(
          "Post-order traversal visits left subtree, then right subtree, then root (Left → Right → Root). It's useful for deleting the tree.",
        )
        break
    }
  }

  // Handle traversal type change
  const handleTraversalTypeChange = (value: string) => {
    setTraversalType(value)
    if (rootNode) {
      const steps = generateTraversalSteps(rootNode, value)
      setTraversalSteps(steps)
      setCurrentStepIndex(-1)
      resetAnimation()
      updateExplanation()
    }
  }

  // Start animation
  const startAnimation = () => {
    if (isAnimating || !rootNode || currentStepIndex >= traversalSteps.length - 1) return

    setIsAnimating(true)

    const animate = () => {
      setCurrentStepIndex((prevIndex) => {
        const nextIndex = prevIndex + 1

        if (nextIndex >= traversalSteps.length) {
          setIsAnimating(false)
          return prevIndex
        }

        animationRef.current = setTimeout(animate, animationSpeed)
        return nextIndex
      })
    }

    animate()
  }

  // Pause animation
  const pauseAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current)
      animationRef.current = null
    }
    setIsAnimating(false)
  }

  // Reset animation
  const resetAnimation = () => {
    pauseAnimation()
    setCurrentStepIndex(-1)
  }

  // Step forward
  const stepForward = () => {
    if (currentStepIndex < traversalSteps.length - 1) {
      setCurrentStepIndex((prevIndex) => prevIndex + 1)
    }
  }

  // Update canvas size on window resize
  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        setCanvasWidth(container.clientWidth)
        setCanvasHeight(Math.max(400, container.clientHeight))
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Update tree when input changes
  useEffect(() => {
    if (rootNode) {
      calculateNodePositions(rootNode)
      drawTree()
    }
  }, [canvasWidth, canvasHeight, rootNode])

  // Update highlighted node when step changes
  useEffect(() => {
    if (!rootNode) return

    resetHighlights(rootNode)

    if (currentStepIndex >= 0 && currentStepIndex < traversalSteps.length) {
      highlightNode(rootNode, traversalSteps[currentStepIndex])
    }

    drawTree()
  }, [currentStepIndex, traversalSteps])

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="/" className="flex items-center justify-center">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="font-bold text-xl">AlgoViz</span>
        </Link>
        <div className="ml-auto"></div>
      </header>

      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Tree Traversal Visualizer</h1>
              <p className="text-gray-500">Visualize different tree traversal algorithms on a binary search tree.</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Controls</CardTitle>
                <CardDescription>Create and traverse a binary search tree</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tree-input">Enter comma-separated values</Label>
                  <div className="flex gap-2">
                    <Input
                      id="tree-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="e.g., 50,30,70,20,40,60,80"
                    />
                    <Button onClick={handleCreateTree}>Create</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Traversal Type</Label>
                  <RadioGroup
                    value={traversalType}
                    onValueChange={handleTraversalTypeChange}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="inorder" id="inorder" />
                      <Label htmlFor="inorder">In-order (LNR)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preorder" id="preorder" />
                      <Label htmlFor="preorder">Pre-order (NLR)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="postorder" id="postorder" />
                      <Label htmlFor="postorder">Post-order (LRN)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="animation-speed">Animation Speed (ms)</Label>
                  <Input
                    id="animation-speed"
                    type="number"
                    min="100"
                    max="3000"
                    step="100"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(Number.parseInt(e.target.value))}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={startAnimation}
                    disabled={isAnimating || !rootNode || currentStepIndex >= traversalSteps.length - 1}
                  >
                    <Play className="h-4 w-4 mr-2" /> Play
                  </Button>
                  <Button onClick={pauseAnimation} disabled={!isAnimating}>
                    <Pause className="h-4 w-4 mr-2" /> Pause
                  </Button>
                  <Button onClick={resetAnimation} disabled={currentStepIndex < 0}>
                    <RotateCcw className="h-4 w-4 mr-2" /> Reset
                  </Button>
                  <Button onClick={stepForward} disabled={currentStepIndex >= traversalSteps.length - 1 || !rootNode}>
                    <StepForward className="h-4 w-4 mr-2" /> Step
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Traversal Progress</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-mono text-sm">
                      {traversalSteps.map((step, index) => (
                        <span key={index} className={index <= currentStepIndex ? "text-primary font-bold" : ""}>
                          {step}
                          {index < traversalSteps.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Explanation</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm">{explanation}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Visualization</CardTitle>
                <CardDescription>Visual representation of the binary search tree</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-auto border rounded-md bg-background">
                  <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} className="w-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full border-t items-center px-4 md:px-6">
        <p className="text-xs text-gray-500">© 2025 AlgoViz. All rights reserved.</p>
      </footer>
    </div>
  )
}

