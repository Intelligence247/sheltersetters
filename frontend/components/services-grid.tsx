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
    <section className="section-py services-section" id="services">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Our Services</h2>
          <p className="body-lg mx-auto max-w-2xl services-subtitle">
            Comprehensive aluminium and building solutions for every need
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon
            return (
              <div key={service.id} id={service.id} className="card services-card group cursor-pointer overflow-hidden">
                <div className="services-image relative mb-4 h-48 overflow-hidden rounded-lg">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="services-image-overlay absolute inset-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                <div className="services-icon mb-4 flex h-16 w-16 items-center justify-center rounded-xl transition-colors group-hover:opacity-90">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="services-title mb-3 text-xl font-bold">{service.title}</h3>
                <p className="services-text body-base mb-6">{service.description}</p>
                <Link href={`#${service.id}`} className="services-link inline-flex items-center gap-2 font-semibold">
                  Learn More
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
