"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Copy, Download, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
// import { toast } from "@/components/ui/use-toast"

// Define operator precedence
const precedence: Record<string, number> = {
  "¬": 4,
  "∧": 3,
  "∨": 2,
  "→": 1,
  "↔": 0,
}

export default function TruthTablePage() {
  const [expression, setExpression] = useState<string>("p ∧ (q ∨ ¬r)")
  const [variables, setVariables] = useState<string[]>([])
  const [truthTable, setTruthTable] = useState<boolean[][]>([])
  const [results, setResults] = useState<boolean[]>([])
  const [error, setError] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("standard")

  // Helper function to convert text operators to symbols
  const convertToSymbols = (expr: string): string => {
    return expr
      .replace(/NOT|not|!/g, "¬")
      .replace(/AND|and|&&/g, "∧")
      .replace(/OR|or|\|\|/g, "∨")
      .replace(/IMPLIES|implies|=>/g, "→")
      .replace(/IFF|iff|<=>/g, "↔")
      .replace(/\s+/g, " ")
      .trim()
  }

  // Helper function to convert symbols to text operators
  const convertToText = (expr: string): string => {
    return expr
      .replace(/¬/g, "NOT ")
      .replace(/∧/g, " AND ")
      .replace(/∨/g, " OR ")
      .replace(/→/g, " IMPLIES ")
      .replace(/↔/g, " IFF ")
  }

  // Extract variables from expression
  const extractVariables = (expr: string): string[] => {
    const vars = new Set<string>()

    for (let i = 0; i < expr.length; i++) {
      const char = expr[i]
      if (/[a-z]/.test(char)) {
        vars.add(char)
      }
    }

    return Array.from(vars).sort()
  }

  // Convert infix expression to postfix (Shunting Yard algorithm)
  const infixToPostfix = (expr: string): string => {
    const output: string[] = []
    const operators: string[] = []

    for (let i = 0; i < expr.length; i++) {
      const token = expr[i]

      if (/[a-z]/.test(token)) {
        // Variable
        output.push(token)
      } else if (token === "¬" || token === "∧" || token === "∨" || token === "→" || token === "↔") {
        // Operator
        while (
          operators.length > 0 &&
          operators[operators.length - 1] !== "(" &&
          precedence[operators[operators.length - 1]] >= precedence[token]
        ) {
          output.push(operators.pop()!)
        }
        operators.push(token)
      } else if (token === "(") {
        // Left parenthesis
        operators.push(token)
      } else if (token === ")") {
        // Right parenthesis
        while (operators.length > 0 && operators[operators.length - 1] !== "(") {
          output.push(operators.pop()!)
        }
        if (operators.length > 0 && operators[operators.length - 1] === "(") {
          operators.pop() // Discard the left parenthesis
        }
      } else if (token !== " ") {
        throw new Error(`Invalid token: ${token}`)
      }
    }

    // Pop remaining operators
    while (operators.length > 0) {
      const op = operators.pop()!
      if (op === "(") {
        throw new Error("Mismatched parentheses")
      }
      output.push(op)
    }

    return output.join(" ")
  }

  // Evaluate postfix expression
  const evaluatePostfix = (postfix: string, values: Record<string, boolean>): boolean => {
    const stack: boolean[] = []
    const tokens = postfix.split(" ")

    for (const token of tokens) {
      if (/[a-z]/.test(token)) {
        // Variable
        stack.push(values[token])
      } else if (token === "¬") {
        // NOT operator
        const operand = stack.pop()
        if (operand === undefined) throw new Error("Invalid expression")
        stack.push(!operand)
      } else {
        // Binary operator
        const right = stack.pop()
        const left = stack.pop()
        if (left === undefined || right === undefined) throw new Error("Invalid expression")

        switch (token) {
          case "∧": // AND
            stack.push(left && right)
            break
          case "∨": // OR
            stack.push(left || right)
            break
          case "→": // IMPLIES
            stack.push(!left || right)
            break
          case "↔": // IFF
            stack.push(left === right)
            break
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error("Invalid expression")
    }

    return stack[0]
  }

  // Generate truth table
  const generateTruthTable = () => {
    try {
      setError("")

      // Convert text operators to symbols if needed
      const processedExpr = activeTab === "text" ? convertToSymbols(expression) : expression

      // Extract variables
      const vars = extractVariables(processedExpr)
      setVariables(vars)

      if (vars.length === 0) {
        setError("No variables found in the expression")
        return
      }

      // Convert to postfix notation
      const postfix = infixToPostfix(processedExpr)

      // Generate all possible combinations of variable values
      const numCombinations = Math.pow(2, vars.length)
      const table: boolean[][] = []
      const resultValues: boolean[] = []

      for (let i = 0; i < numCombinations; i++) {
        const row: boolean[] = []
        const values: Record<string, boolean> = {}

        // Generate values for this row
        for (let j = 0; j < vars.length; j++) {
          const value = Boolean((i >> (vars.length - 1 - j)) & 1)
          row.push(value)
          values[vars[j]] = value
        }

        // Evaluate expression for this row
        try {
          const result = evaluatePostfix(postfix, values)
          resultValues.push(result)
        } catch (err) {
          setError(`Error evaluating expression: ${err instanceof Error ? err.message : String(err)}`)
          return
        }

        table.push(row)
      }

      setTruthTable(table)
      setResults(resultValues)
    } catch (err) {
      setError(`Error parsing expression: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Handle expression change
  const handleExpressionChange = (value: string) => {
    setExpression(value)
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    // Convert expression format when switching tabs
    if (value === "text" && activeTab === "standard") {
      setExpression(convertToText(expression))
    } else if (value === "standard" && activeTab === "text") {
      setExpression(convertToSymbols(expression))
    }
  }

  // Copy truth table to clipboard
  const copyToClipboard = () => {
    if (variables.length === 0 || truthTable.length === 0) return

    let tableText = variables.join("\t") + "\t" + expression + "\n"

    for (let i = 0; i < truthTable.length; i++) {
      const row = truthTable[i]
      tableText += row.map((val) => (val ? "T" : "F")).join("\t") + "\t" + (results[i] ? "T" : "F") + "\n"
    }

    navigator.clipboard.writeText(tableText)
    // toast({
    //   title: "Copied to clipboard",
    //   description: "Truth table has been copied to clipboard",
    // })
  }

  // Download truth table as CSV
  const downloadCSV = () => {
    if (variables.length === 0 || truthTable.length === 0) return

    let csvContent = variables.join(",") + "," + expression + "\n"

    for (let i = 0; i < truthTable.length; i++) {
      const row = truthTable[i]
      csvContent += row.map((val) => (val ? "TRUE" : "FALSE")).join(",") + "," + (results[i] ? "TRUE" : "FALSE") + "\n"
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "truth_table.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Generate truth table on component mount and when expression changes
  useEffect(() => {
    if (expression) {
      generateTruthTable()
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
              <h1 className="text-3xl font-bold">Truth Table Generator</h1>
              <p className="text-gray-500">
                Generate truth tables for logical expressions and boolean algebra formulas.
              </p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Input Expression</CardTitle>
                <CardDescription>Enter a logical expression using the operators below</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="standard">Symbol Notation</TabsTrigger>
                    <TabsTrigger value="text">Text Notation</TabsTrigger>
                  </TabsList>
                  <TabsContent value="standard" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="expression">Expression</Label>
                      <Textarea
                        id="expression"
                        value={expression}
                        onChange={(e) => handleExpressionChange(e.target.value)}
                        placeholder="e.g., p ∧ (q ∨ ¬r)"
                        className="font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " ¬")}
                        className="font-mono"
                      >
                        ¬ (NOT)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " ∧")}
                        className="font-mono"
                      >
                        ∧ (AND)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " ∨")}
                        className="font-mono"
                      >
                        ∨ (OR)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " →")}
                        className="font-mono"
                      >
                        → (IMPLIES)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " ↔")}
                        className="font-mono"
                      >
                        ↔ (IFF)
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " (")}
                        className="font-mono"
                      >
                        (
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + ")")}
                        className="font-mono"
                      >
                        )
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="text" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="text-expression">Expression</Label>
                      <Textarea
                        id="text-expression"
                        value={expression}
                        onChange={(e) => handleExpressionChange(e.target.value)}
                        placeholder="e.g., p AND (q OR NOT r)"
                        className="font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " NOT ")}
                        className="font-mono"
                      >
                        NOT
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " AND ")}
                        className="font-mono"
                      >
                        AND
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " OR ")}
                        className="font-mono"
                      >
                        OR
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " IMPLIES ")}
                        className="font-mono"
                      >
                        IMPLIES
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " IFF ")}
                        className="font-mono"
                      >
                        IFF
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + " (")}
                        className="font-mono"
                      >
                        (
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleExpressionChange(expression + ")")}
                        className="font-mono"
                      >
                        )
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label>Variables</Label>
                  <div className="p-3 bg-muted rounded-md">
                    <p className="font-mono">{variables.length > 0 ? variables.join(", ") : "No variables detected"}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateTruthTable} className="flex-1">
                    <RefreshCw className="h-4 w-4 mr-2" /> Generate
                  </Button>
                </div>

                {error && (
                  <div className="p-3 bg-destructive/10 text-destructive rounded-md">
                    <p>{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Operator Precedence</Label>
                  <div className="p-3 bg-muted rounded-md text-sm">
                    <p>1. ¬ (NOT) - highest</p>
                    <p>2. ∧ (AND)</p>
                    <p>3. ∨ (OR)</p>
                    <p>4. → (IMPLIES)</p>
                    <p>5. ↔ (IFF) - lowest</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Truth Table</CardTitle>
                <CardDescription>
                  {variables.length > 0
                    ? `Truth table for ${expression} with ${variables.length} variables (${truthTable.length} rows)`
                    : "Enter an expression to generate a truth table"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {variables.length > 0 && truthTable.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {variables.map((variable, index) => (
                            <TableHead key={index} className="font-mono">
                              {variable}
                            </TableHead>
                          ))}
                          <TableHead className="font-mono">{expression}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {truthTable.map((row, rowIndex) => (
                          <TableRow key={rowIndex}>
                            {row.map((value, colIndex) => (
                              <TableCell key={colIndex} className="font-mono">
                                {value ? "T" : "F"}
                              </TableCell>
                            ))}
                            <TableCell className={`font-mono font-bold ${results[rowIndex] ? "text-primary" : ""}`}>
                              {results[rowIndex] ? "T" : "F"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 border rounded-md bg-muted/30">
                    <p className="text-muted-foreground">No truth table to display</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={copyToClipboard}
                  disabled={variables.length === 0 || truthTable.length === 0}
                >
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
                <Button
                  variant="outline"
                  onClick={downloadCSV}
                  disabled={variables.length === 0 || truthTable.length === 0}
                >
                  <Download className="h-4 w-4 mr-2" /> Download CSV
                </Button>
              </CardFooter>
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

