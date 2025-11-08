"use client"

import { Package } from "lucide-react"

export default function ProductCatalog() {
  const products = [
    { name: "Classic", category: "Roofing Sheets" },
    { name: "Romania Shakes", category: "Roofing Sheets" },
    { name: "Bond Shingles", category: "Roofing Sheets" },
    { name: "Milano Romanaz", category: "Roofing Sheets" },
    { name: "Zinc/GI", category: "Industrial" },
    { name: "Industrial 6", category: "Industrial" },
    { name: "Longspan", category: "Commercial" },
    { name: "Metcopol", category: "Commercial" },
    { name: "Steptiles", category: "Residential" },
  ]

  const categories = ["Roofing Sheets", "Industrial", "Commercial", "Residential"]
  const categoryColors = {
    "Roofing Sheets": "#BD5A00",
    Industrial: "#3F7A89",
    Commercial: "#254E63",
    Residential: "#0E293B",
  }

  return (
    <section className="section-py" style={{ backgroundColor: "var(--neutral-200)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Product Catalog</h2>
          <p className="body-lg max-w-2xl mx-auto">
            A comprehensive range of premium aluminium and roofing solutions for every project
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="card group hover:shadow-lg transition-shadow duration-300"
              style={{
                borderLeft: `5px solid ${categoryColors[product.category as keyof typeof categoryColors]}`,
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="heading-md mb-1" style={{ fontSize: "1.25rem" }}>
                    {product.name}
                  </h3>
                  <p className="body-sm">{product.category}</p>
                </div>
                <Package
                  className="w-6 h-6"
                  style={{ color: categoryColors[product.category as keyof typeof categoryColors] }}
                />
              </div>
              <p className="body-sm opacity-80">Premium quality product built to last</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#contact" className="btn-primary">
            Request Product Information
          </a>
        </div>
      </div>
    </section>
  )
}
