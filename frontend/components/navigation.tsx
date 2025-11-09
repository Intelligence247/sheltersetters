"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import Image from "next/image"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 w-full z-50 border-b shadow-sm transition-colors duration-300"
      style={{
        backgroundColor: "var(--neutral-white)",
        borderColor: "var(--color-metal-300)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex items-center gap-3 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center">
                <Image src={"/logo3.png"} alt="Shelter Setters logo" height={46} width={46} />
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
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#services"
              className="text-sm font-medium transition-colors hover:text-[#BD5A00]"
              style={{ color: "var(--text-secondary)" }}
            >
              Services
            </Link>
            <Link
              href="#projects"
              className="text-sm font-medium transition-colors hover:text-[#BD5A00]"
              style={{ color: "var(--text-secondary)" }}
            >
              Projects
            </Link>
            <Link
              href="#about"
              className="text-sm font-medium transition-colors hover:text-[#BD5A00]"
              style={{ color: "var(--text-secondary)" }}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium transition-colors hover:text-[#BD5A00]"
              style={{ color: "var(--text-secondary)" }}
            >
              Contact
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link href="#contact" className="btn-primary">
              Request Quote
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
            {isOpen ? (
              <X className="w-6 h-6" style={{ color: "var(--color-primary-900)" }} />
            ) : (
              <Menu className="w-6 h-6" style={{ color: "var(--color-primary-900)" }} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div
            className="md:hidden pb-4 space-y-3 border-t transition-colors"
            style={{ borderColor: "var(--color-metal-300)" }}
          >
            <Link
              href="#services"
              className="block py-2 px-4 rounded-lg transition-colors hover:bg-[#E9EEF0]"
              style={{ color: "var(--text-secondary)" }}
            >
              Services
            </Link>
            <Link
              href="#projects"
              className="block py-2 px-4 rounded-lg transition-colors hover:bg-[#E9EEF0]"
              style={{ color: "var(--text-secondary)" }}
            >
              Projects
            </Link>
            <Link
              href="#about"
              className="block py-2 px-4 rounded-lg transition-colors hover:bg-[#E9EEF0]"
              style={{ color: "var(--text-secondary)" }}
            >
              About
            </Link>
            <Link
              href="#contact"
              className="block py-2 px-4 rounded-lg transition-colors hover:bg-[#E9EEF0]"
              style={{ color: "var(--text-secondary)" }}
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
