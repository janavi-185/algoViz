import type React from "react"
import "@/app/globals.css"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata = {
  title: "AlgoViz - Algorithm Visualization",
  description: "Interactive visualizations for tree traversal and truth tables",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

