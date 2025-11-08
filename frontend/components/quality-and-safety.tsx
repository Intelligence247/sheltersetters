"use client"

import { Shield, ClipboardCheck, Zap } from "lucide-react"

export default function QualityAndSafety() {
  return (
    <section className="section-py bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img
              src="/workers-inspecting-finished-aluminium-sheets-quali.jpg"
              alt="Workers inspecting finished aluminium sheets quality assurance"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div>
            <h2 className="heading-lg mb-8">Quality & Safety Excellence</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E9EEF0" }}
                  >
                    <Shield className="w-6 h-6" style={{ color: "#BD5A00" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#0E293B" }}>
                    Strict Quality Control
                  </h3>
                  <p className="body-base">
                    We adhere to rigorous quality assurance measures at every stage of production and installation,
                    ensuring all materials meet international standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E9EEF0" }}
                  >
                    <ClipboardCheck className="w-6 h-6" style={{ color: "#BD5A00" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#0E293B" }}>
                    Safety Certified
                  </h3>
                  <p className="body-base">
                    All staff are trained in occupational health and equipment handling, maintaining active workplace
                    safety protocols and hazard prevention.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#E9EEF0" }}
                  >
                    <Zap className="w-6 h-6" style={{ color: "#BD5A00" }} />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#0E293B" }}>
                    Industry Standards
                  </h3>
                  <p className="body-base">
                    Our operations comply with both national and international standards, ensuring reliability and
                    performance in every project.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
