import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

// ...existing code...

export const metadata: Metadata = {
  title: "Yadu Pushup - Build Strength Daily",
  description: "Track your daily pushup progress and build a consistent workout habit",
  keywords: "pushup, fitness, tracker, workout, exercise, strength",
  authors: [{ name: "Yadu Pushup" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  themeColor: "#4f46e5",
  manifest: "/manifest.json",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Yadu Pushup" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
//