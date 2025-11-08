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
    <section className="section-py bg-[#FBFCFD]" id="about">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Why Choose Shelter Setters</h2>
          <p className="body-lg max-w-2xl mx-auto">
            We've built our reputation on quality, reliability, and customer satisfaction
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="card group hover:shadow-xl" style={{ animationDelay: `${index * 0.1}s` }}>
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ backgroundColor: "#E9EEF0" }}
                >
                  <Icon className="w-7 h-7" style={{ color: "#3F7A89" }} />
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: "#0E293B" }}>
                  {item.title}
                </h3>
                <p className="body-sm">{item.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
