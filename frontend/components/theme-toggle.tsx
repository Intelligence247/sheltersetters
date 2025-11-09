"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Check for saved theme preference; default to light
    const saved = localStorage.getItem("theme")
    const shouldBeDark = saved ? saved === "dark" : false
    setIsDark(shouldBeDark)
    document.documentElement.dataset.theme = shouldBeDark ? "dark" : "light"
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
    document.documentElement.dataset.theme = newTheme ? "dark" : "light"
  }

  if (!isMounted) return null

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 p-3 rounded-lg transition-all duration-300 z-50"
      style={{
        backgroundColor: isDark ? "#0f2431" : "#FFFFFF",
        border: `2px solid ${isDark ? "#3F7A89" : "#D8DEE0"}`,
        color: isDark ? "#FBFCFD" : "#0E293B",
      }}
      aria-label="Toggle dark mode"
    >
      {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  )
}
