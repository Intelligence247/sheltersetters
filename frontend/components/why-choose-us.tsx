"use client"

import { Users, Zap, Truck, Building2 } from "lucide-react"

const reasons = [
  {
    icon: Zap,
    title: "20+ Years of Experience",
    description: "Two decades of proven excellence in aluminium production and installation",
  },
  {
    icon: Users,
    title: "Certified Workforce",
    description: "Skilled, trained, and certified technical professionals",
  },
  {
    icon: Building2,
    title: "Modern Production Facility",
    description: "State-of-the-art equipment and cutting-edge fabrication workshop",
  },
  {
    icon: Truck,
    title: "Reliable Delivery Nationwide",
    description: "Timely project execution with dedicated logistics support",
  },
]

export default function WhyChooseUs() {
  return (
    <section className="section-py reason-section" id="about">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Why Choose Shelter Setters</h2>
          <p className="body-lg mx-auto max-w-2xl reason-subtitle">
            We've built our reputation on quality, reliability, and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="card reason-card group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="reason-icon mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-colors group-hover:opacity-90">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="reason-title mb-2 text-lg font-bold">{item.title}</h3>
                <p className="reason-text body-sm">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
