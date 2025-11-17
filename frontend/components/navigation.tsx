"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  
  // Check if we're on a news page
  const isNewsPage = pathname?.startsWith("/news")

  return (
    <nav className="navigation-bar fixed top-0 z-50 w-full border-b shadow-sm transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3 transition-colors">
              <div className="flex h-16 w-16 items-center justify-center">
                <Image src={"/official-logo2.png"} alt="Shelter Setters logo" height={64} width={64} className="object-contain object-center scale-[1.25]" />
              </div>
              <div className="lg:flex hidden flex-col leading-tight">
                <span className="nav-brand-primary text-xs font-semibold uppercase tracking-[0.35em]">
                  Shelter Setters
                </span>
                <span className="nav-brand-secondary text-[10px] uppercase tracking-[0.2em]">
                  Aluminium and Experts Nig. Ltd
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/#services"
              className="navigation-link text-sm font-medium transition-colors hover:text-[#BD5A00]"
            >
              Services
            </Link>
            <Link
              href="/#about"
              className="navigation-link text-sm font-medium transition-colors hover:text-[#BD5A00]"
            >
              About
            </Link>
            <Link
              href="/#projects"
              className="navigation-link text-sm font-medium transition-colors hover:text-[#BD5A00]"
            >
              Projects
            </Link>
            <Link
              href="/#contact"
              className="navigation-link text-sm font-medium transition-colors hover:text-[#BD5A00]"
            >
              Contact
            </Link>
            <Link
              href="/news"
              className="navigation-link text-sm font-medium transition-colors hover:text-[#BD5A00]"
              style={isNewsPage ? { color: "#F0A500", fontWeight: 600 } : undefined}
            >
              News
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="#contact" className="btn-primary">
              Request Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-[#0E293B] transition-colors dark:text-[#F7C08A]"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu space-y-3 border-t pb-4 transition-colors md:hidden">
            <Link
              href="#services"
              className="mobile-nav-link block rounded-lg px-4 py-2 transition-colors"
            >
              Services
            </Link>
            <Link
              href="#projects"
              className="mobile-nav-link block rounded-lg px-4 py-2 transition-colors"
            >
              Projects
            </Link>
            <Link
              href="#about"
              className="mobile-nav-link block rounded-lg px-4 py-2 transition-colors"
            >
              About
            </Link>
            <Link
              href="/news"
              className="mobile-nav-link block rounded-lg px-4 py-2 transition-colors"
              style={isNewsPage ? { color: "#F0A500", fontWeight: 600, backgroundColor: "rgba(240, 165, 0, 0.1)" } : undefined}
            >
              News
            </Link>
            <Link
              href="#contact"
              className="mobile-nav-link block rounded-lg px-4 py-2 transition-colors"
            >
              Contact
            </Link>
            <Link href="#contact" className="block btn-primary">
              Request Quote
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
