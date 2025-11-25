"use client"

import Link from "next/link"
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Image from "next/image"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0E293B] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-16 h-16 rounded-lg flex items-center justify-center font-bold text-lg">
                <Image src={"/official-logo2.png"} alt="logo" height={64} width={64} className="object-contain object-center" />
              </div>
              <span className="font-bold text-lg">Shelter Setters</span>
            </div>
            <p className="text-sm text-white/70">Premium aluminium and roofing solutions since 2002</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#services" className="text-white/70 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#projects" className="text-white/70 hover:text-white transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/#about" className="text-white/70 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/#contact" className="text-white/70 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#roofing" className="text-white/70 hover:text-white transition-colors">
                  Roofing Sheets
                </a>
              </li>
              <li>
                <a href="/#windows" className="text-white/70 hover:text-white transition-colors">
                  Window Fabrication
                </a>
              </li>
              <li>
                <a href="/#partitions" className="text-white/70 hover:text-white transition-colors">
                  Glass Partitions
                </a>
              </li>
              <li>
                <a href="/#interior" className="text-white/70 hover:text-white transition-colors">
                  Interior Finishing
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-sm text-white/70 mb-3">
              <a href="tel:+234-9072629100" className="hover:text-white transition-colors">
                +234 907 262 9100
              </a>
            </p>
            <p className="text-sm text-white/70">
              <a href="mailto:info.ssaeltd@gmail.com" className="hover:text-white transition-colors">
                info.ssaeltd@gmail.com
              </a>
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          {/* Social Links */}
          <div className="flex gap-4 mb-6">
            <a
              href="https://web.facebook.com/SSAENigeria"
              target="_blank"
              aria-label="Facebook"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[#BD5A00]"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://x.com/ssaluminiumltd"
              target="_blank"
              aria-label="Twitter"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[#BD5A00]"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/shelter-setters-aluminium-experts-7906a715b/"
              target="_blank"
              aria-label="LinkedIn"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[#BD5A00]"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com/sheltersetters"
              target="_blank"
              aria-label="Instagram"
              className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors hover:bg-[#BD5A00]"
            >
              <Instagram className="w-5 h-5" />
            </a>
          </div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p>&copy; {currentYear} Shelter Setters Aluminium and Experts Nig. Ltd. All rights reserved.</p>
            <p>CAC RC: 438494 | Proudly Nigerian</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
