"use client"

import React, { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { toast } from "sonner"

import { API_BASE_URL } from "@/lib/config"

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  message: "",
}

export default function ContactSection() {
  const [formData, setFormData] = useState(initialFormState)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (submitting) return

    setSubmitting(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
        }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to send message")
      }

      toast.success("Message sent", {
        description: payload?.message || "Thank you for reaching out. We'll respond shortly.",
      })
      setFormData(initialFormState)
    } catch (error: any) {
      toast.error("Message not sent", {
        description: error?.message || "Please try again or use the phone numbers listed.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section-py contact-section" id="contact">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <h2 className="heading-lg mb-8">Get in Touch</h2>

            <div className="space-y-8">
              <div className="contact-item flex gap-4">
                <div className="contact-icon flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="contact-title mb-2 text-lg font-bold">Visit Us</h3>
                  <p className="contact-text body-base">
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

              <div className="contact-item flex gap-4">
                <div className="contact-icon flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="contact-title mb-2 text-lg font-bold">Call Us</h3>
                  <p className="contact-text body-base mb-1">
                    <a href="tel:+234-9014476652" className="hover:underline">
                      +234 901 447 6652
                    </a>
                  </p>
                  <p className="contact-text body-base mb-1">
                    <a href="tel:+234-9072629100" className="hover:underline">
                      +234 907 262 9100
                    </a>
                  </p>
                  <p className="contact-text body-base">
                    <a href="tel:+234-7032552716" className="hover:underline">
                      +234 703 255 2716
                    </a>
                  </p>
                </div>
              </div>

              <div className="contact-item flex gap-4">
                <div className="contact-icon flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="contact-title mb-2 text-lg font-bold">Email</h3>
                  <p className="contact-text body-base">
                    <a href="mailto:info.ssaeltd@gmail.com" className="hover:underline">
                      info.ssaeltd@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="contact-form space-y-6">
            <h3 className="contact-form-title text-2xl font-bold">Send us a Message</h3>

            <div>
              <label htmlFor="name" className="contact-label block text-sm font-medium">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="contact-input"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="contact-label block text-sm font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="contact-input"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="contact-label block text-sm font-medium">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="contact-input"
                placeholder="+234 901 234 5678"
              />
            </div>

            <div>
              <label htmlFor="message" className="contact-label block text-sm font-medium">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="contact-textarea"
                placeholder="Tell us about your project..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary inline-flex w-full items-center justify-center gap-2 disabled:opacity-70"
              disabled={submitting}
            >
              {submitting ? "Sending…" : "Send Message"}
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
