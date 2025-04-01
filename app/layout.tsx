import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "Solo Leveling - Офіційний сайт аніме",
  description:
    "Офіційний сайт аніме Solo Leveling. Дізнайтеся більше про персонажів, сюжет та світ найпопулярнішого аніме.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uk" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}