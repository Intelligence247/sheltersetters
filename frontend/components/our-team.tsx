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
    <section className="section-py team-section">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Our Leadership Team</h2>
          <p className="body-lg mx-auto max-w-2xl team-subtitle">
            Experienced professionals driving excellence in aluminium fabrication and construction
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member) => (
            <div key={member.name} className="team-card text-center">
              <div className="team-image relative mb-6 h-64 overflow-hidden rounded-2xl">
                <img
                  src={member.image}
                  alt={member.alt}
                  className="h-full w-full rounded-2xl object-cover"
                />
              </div>
              <h3 className="team-name mb-1 text-xl font-bold">{member.name}</h3>
              <p className="team-role font-medium">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
