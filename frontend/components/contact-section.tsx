"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
  }

  return (
    <section className="section-py bg-white" id="contact">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="heading-lg mb-8">Get in Touch</h2>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <MapPin className="w-6 h-6" style={{ color: "#BD5A00" }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0E293B" }}>
                    Visit Us
                  </h3>
                  <p className="body-base">
                    Plot 4/6 Shelter Setters Street
                    <br />
                    Off Hajj Camp Road, Gaa Odota
                    <br />
                    Adewole Industrial Estate
                    <br />
                    Ilorin, Kwara State, Nigeria
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="w-6 h-6" style={{ color: "#BD5A00" }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0E293B" }}>
                    Call Us
                  </h3>
                  <p className="body-base mb-1">
                    <a href="tel:+234-9014476652" className="hover:underline">
                      +234 901 447 6652
                    </a>
                  </p>
                  <p className="body-base mb-1">
                    <a href="tel:+234-9072629100" className="hover:underline">
                      +234 907 262 9100
                    </a>
                  </p>
                  <p className="body-base">
                    <a href="tel:+234-7032552716" className="hover:underline">
                      +234 703 255 2716
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="w-6 h-6" style={{ color: "#BD5A00" }} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: "#0E293B" }}>
                    Email
                  </h3>
                  <p className="body-base">
                    <a href="mailto:info.ssaeltd@gmail.com" className="hover:underline">
                      info.ssaeltd@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <h3 className="text-2xl font-bold" style={{ color: "#0E293B" }}>
              Send us a Message
            </h3>

            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2" style={{ color: "#0E293B" }}>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D8DEE0] focus:outline-none focus:border-[#3F7A89] transition-colors"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: "#0E293B" }}>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D8DEE0] focus:outline-none focus:border-[#3F7A89] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: "#0E293B" }}>
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-[#D8DEE0] focus:outline-none focus:border-[#3F7A89] transition-colors"
                placeholder="+234 901 234 5678"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2" style={{ color: "#0E293B" }}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-lg border border-[#D8DEE0] focus:outline-none focus:border-[#3F7A89] transition-colors resize-none"
                placeholder="Tell us about your project..."
              />
            </div>

            <button type="submit" className="btn-primary w-full inline-flex items-center justify-center gap-2">
              Send Message
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
