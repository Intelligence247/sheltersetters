"use client"

import { Heart, Users, BookOpen } from "lucide-react"

export default function CSRSection() {
  return (
    <section
      className="section-py bg-gradient-to-r"
      style={{
        backgroundImage: `linear-gradient(135deg, #0E293B 0%, #254E63 100%)`,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="community-heading heading-lg mb-6 text-white">Community Impact & Social Responsibility</h2>
            <p className="body-lg text-white/90 mb-8">
              At Shelter Setters, we believe in giving back to the communities we serve. We are committed to sustainable
              development through impactful CSR initiatives.
            </p>

            <div className="space-y-4">
              <div className="flex gap-4">
                <Heart className="w-6 h-6 flex-shrink-0" style={{ color: "#BD5A00" }} />
                <div>
                  <h4 className="font-bold mb-2 text-white">Youth Apprenticeship Programs</h4>
                  <p className="text-white/80">Training young people in aluminium fabrication and technical skills</p>
                </div>
              </div>
              <div className="flex gap-4">
                <BookOpen className="w-6 h-6 flex-shrink-0" style={{ color: "#BD5A00" }} />
                <div>
                  <h4 className="font-bold mb-2 text-white">Skill Empowerment</h4>
                  <p className="text-white/80">Vocational training sponsorship in local communities</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="w-6 h-6 flex-shrink-0" style={{ color: "#BD5A00" }} />
                <div>
                  <h4 className="font-bold mb-2 text-white">Sustainable Livelihoods</h4>
                  <p className="text-white/80">
                    Supporting individuals and communities in building lasting economic independence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative h-96 rounded-2xl overflow-hidden">
            <img
              src="/youth-apprenticeship-training-program-in-aluminium.jpg"
              alt="Youth apprenticeship training program in aluminium fabrication"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
