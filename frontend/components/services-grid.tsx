"use client"

import Link from "next/link"
import { Hammer, AppWindow as Window, PanelRight, Wrench, Boxes, Sofa, ChevronRight } from "lucide-react"

const services = [
  {
    icon: Hammer,
    title: "Aluminium Roofing",
    description: "High-quality aluminium and composite roofing sheets production with superior durability",
    id: "roofing",
    image: "/aluminium-roofing-sheets-product-showcase.jpg",
  },
  {
    icon: Window,
    title: "Window Fabrication",
    description: "Custom sliding, casement windows and shopfront systems tailored to specifications",
    id: "windows",
    image: "/modern-window-glass-installation-design.jpg",
  },
  {
    icon: PanelRight,
    title: "Glass Partitioning",
    description: "Modern office partitions and glass installations for contemporary workspaces",
    id: "partitions",
    image: "/office-glass-partition-interior-design.jpg",
  },
  {
    icon: Wrench,
    title: "Metal Fabrication",
    description: "Precision structural fabrication and welding services for complex projects",
    id: "fabrication",
    image: "/industrial-metal-fabrication-welding.jpg",
  },
  {
    icon: Boxes,
    title: "Doors Distribution",
    description: "Wide range of doors and protective barriers for residential and commercial use",
    id: "doors",
    image: "/modern-door-design-collection-showcase.jpg",
  },
  {
    icon: Sofa,
    title: "Interior Finishing",
    description: "Complete interior solutions including ceilings, wardrobes, and custom fittings",
    id: "interior",
    image: "/modern-interior-design-office-ceiling.jpg",
  },
]

export default function ServicesGrid() {
  return (
    <section className="section-py bg-white" id="services">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Services</h2>
          <p className="body-lg max-w-2xl mx-auto">Comprehensive aluminium and building solutions for every need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={index}
                className="group card hover:border-[#3F7A89] cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: "#E9EEF0" }}
                >
                  <Icon className="w-8 h-8" style={{ color: "#BD5A00" }} />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ color: "#0E293B" }}>
                  {service.title}
                </h3>
                <p className="body-base mb-6">{service.description}</p>
                <Link
                  href={`#${service.id}`}
                  className="inline-flex items-center gap-2 font-semibold transition-all hover:gap-3"
                  style={{ color: "#BD5A00" }}
                >
                  Learn More
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
