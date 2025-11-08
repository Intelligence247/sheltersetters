"use client"

import { Building2, Hammer, Building, Hotel, Briefcase, Home, Shield, GraduationCap } from "lucide-react"

export default function IndustriesServed() {
  const industries = [
    {
      icon: Building2,
      title: "Real Estate Developers",
      description: "Large-scale residential and commercial projects",
    },
    {
      icon: Hammer,
      title: "Construction Firms",
      description: "Engineering and civil construction solutions",
    },
    {
      icon: Shield,
      title: "Government Projects",
      description: "Official and institutional infrastructure",
    },
    {
      icon: Briefcase,
      title: "Corporate Institutions",
      description: "Office spaces and corporate facilities",
    },
    {
      icon: Hotel,
      title: "Hotels & Hospitality",
      description: "Hospitality centers and leisure facilities",
    },
    {
      icon: GraduationCap,
      title: "Educational Facilities",
      description: "Schools and training institutions",
    },
    {
      icon: Building,
      title: "Healthcare Facilities",
      description: "Hospitals and medical centers",
    },
    {
      icon: Home,
      title: "Individual Homeowners",
      description: "Residential renovation and construction",
    },
  ]

  return (
    <section className="section-py" style={{ backgroundColor: "var(--bg-page)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Industries We Serve</h2>
          <p className="body-lg max-w-2xl mx-auto">Trusted by diverse sectors across Nigeria for quality solutions</p>
        </div>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => {
            const Icon = industry.icon
            return (
              <div key={index} className="card group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: index % 2 === 0 ? "#BD5A00" : "#3F7A89" }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="heading-md mb-2" style={{ fontSize: "1.125rem" }}>
                  {industry.title}
                </h3>
                <p className="body-sm">{industry.description}</p>
              </div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 p-8 rounded-lg text-center" style={{ backgroundColor: "#3F7A89" }}>
          <h3 className="heading-md mb-2" style={{ color: "white" }}>
            Looking for a Specialized Solution?
          </h3>
          <p className="body-base mb-6" style={{ color: "rgba(255,255,255,0.9)" }}>
            We customize our services to meet your industry needs
          </p>
          <a href="#contact" className="btn-primary" style={{ backgroundColor: "#BD5A00" }}>
            Schedule a Consultation
          </a>
        </div>
      </div>
    </section>
  )
}
