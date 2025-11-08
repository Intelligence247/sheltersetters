"use client"

const team = [
  {
    name: "Dr. Hassan Ibrahim Sani",
    role: "MD/CEO",
    alt: "Portrait of Dr. Hassan Ibrahim Sani MD/CEO of Shelter Setters",
    image:"/ceo.png",
  },
  {
    name: "Ariyo Ojo Tosin",
    role: "Human Resource Manager",
    alt: "Portrait of Ariyo Ojo Tosin Human Resource Manager",
    image:"/ariyo.png",
  },
  {
    name: "Winner Kelechi N.",
    role: "Management Consultant",
    alt: "Portrait of Winner Kelechi N. Management Consultant",
    image:"/winner.png",
  },
  {
    name: "Aliy Ibrahim",
    role: "Director",
    alt: "Portrait of Aliy Ibrahim Director",
    image:"/default.png",
  },
  {
    name: "Hamzah Ibrahim",
    role: "Director",
    alt: "Portrait of Hamzah Ibrahim Director",
    image:"/default.png",
  },
  {
    name: "Habeeb Hamisu",
    role: "General Manager",
    alt: "Portrait of Habeeb Hamisu General Manager",
    image:"/default.png",
  },
]

export default function OurTeam() {
  return (
    <section className="section-py bg-[#FBFCFD]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Our Leadership Team</h2>
          <p className="body-lg max-w-2xl mx-auto">
            Experienced professionals driving excellence in aluminium fabrication and construction
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div key={index} className="text-center">
              <div className="relative h-64 mb-6 rounded-2xl overflow-hidden bg-[#E9EEF0]">
                <img
                  src={`${member.image}`}
                  alt={member.alt}
                  className="w-full h-full object-cover rounded-2xl p-2"
                />
              </div>
              <h3 className="text-xl font-bold mb-1" style={{ color: "#0E293B" }}>
                {member.name}
              </h3>
              <p className="font-medium" style={{ color: "#BD5A00" }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
