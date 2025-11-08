"use client"

import { Heart, Lightbulb, Users, TrendingUp, Shield } from "lucide-react"

export default function CoreValues() {
  const values = [
    {
      icon: Shield,
      title: "Integrity",
      description: "We do what we say, with transparency and honesty in every interaction.",
      color: "#BD5A00",
    },
    {
      icon: TrendingUp,
      title: "Quality",
      description: "We pursue excellence in every product, design and service we deliver.",
      color: "#3F7A89",
    },
    {
      icon: Heart,
      title: "Customer Focus",
      description: "Our clients' satisfaction drives our operations and long-term success.",
      color: "#254E63",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "We constantly improve our methods, technologies and service delivery.",
      color: "#BD5A00",
    },
    {
      icon: Users,
      title: "Teamwork",
      description: "We achieve more by working together and prioritize safety always.",
      color: "#3F7A89",
    },
  ]

  return (
    <section className="section-py" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Core Values</h2>
          <p className="body-lg max-w-2xl mx-auto">The principles that guide everything we do at Shelter Setters</p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <div
                key={index}
                className="card group hover:scale-105 transition-transform duration-300"
                style={{
                  borderTop: `4px solid ${value.color}`,
                }}
              >
                <div className="mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: value.color }}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="heading-md mb-2" style={{ fontSize: "1.125rem" }}>
                  {value.title}
                </h3>
                <p className="body-sm">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
