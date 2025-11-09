"use client"

import { Shield, ClipboardCheck, Zap } from "lucide-react"

export default function QualityAndSafety() {
  return (
    <section className="section-py quality-section">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="quality-image relative h-96 overflow-hidden rounded-2xl">
            <img
              src="/workers-inspecting-finished-aluminium-sheets-quali.jpg"
              alt="Workers inspecting finished aluminium sheets quality assurance"
              className="h-full w-full object-cover"
            />
          </div>

          <div>
            <h2 className="heading-lg mb-8">Quality & Safety Excellence</h2>

            <div className="space-y-6">
              <div className="quality-item flex gap-4">
                <div className="quality-icon flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="quality-title mb-2 text-lg font-bold">Strict Quality Control</h3>
                  <p className="quality-text body-base">
                    We adhere to rigorous quality assurance measures at every stage of production and installation,
                    ensuring all materials meet international standards.
                  </p>
                </div>
              </div>

              <div className="quality-item flex gap-4">
                <div className="quality-icon flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <ClipboardCheck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="quality-title mb-2 text-lg font-bold">Safety Certified</h3>
                  <p className="quality-text body-base">
                    All staff are trained in occupational health and equipment handling, maintaining active workplace
                    safety protocols and hazard prevention.
                  </p>
                </div>
              </div>

              <div className="quality-item flex gap-4">
                <div className="quality-icon flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="quality-title mb-2 text-lg font-bold">Industry Standards</h3>
                  <p className="quality-text body-base">
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
