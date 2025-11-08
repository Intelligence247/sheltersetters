"use client"

const projects = [
  {
    title: "Residential Complex Roofing",
    location: "Ilorin, Kwara State",
    year: "2024",
    image: "Shelter Setters completed residential roofing project with modern aluminium design",
    description: "Complete roofing installation using premium aluminium sheets",
  },
  {
    title: "Commercial Office Fitout",
    location: "Lagos, Nigeria",
    year: "2023",
    image: "Completed aluminium window and glass partitioning installation for commercial office building",
    description: "Glass partitioning and aluminium window systems",
  },
  {
    title: "Industrial Facility Renovation",
    location: "Kaduna Industrial Estate",
    year: "2023",
    image: "Industrial aluminium roofing and cladding solution for factory",
    description: "Large-scale roofing and cladding project",
  },
  {
    title: "Luxury Residential Build",
    location: "Abuja, Nigeria",
    year: "2024",
    image: "High-end residential project featuring custom aluminium facades and window systems",
    description: "Premium architectural aluminium solutions",
  },
]

export default function FeaturedProjects() {
  return (
    <section className="section-py bg-[#FBFCFD]" id="projects">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="heading-lg mb-4">Featured Projects</h2>
          <p className="body-lg max-w-2xl mx-auto">
            Showcasing excellence across residential, commercial, and industrial sectors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {projects.map((project, index) => (
            <div key={index} className="card group overflow-hidden hover:shadow-xl">
              <div className="relative h-48 bg-[#E9EEF0] rounded-lg overflow-hidden mb-4">
                <img
                  src={`/.jpg?height=300&width=400&query=${project.image}`}
                  alt={project.image}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#0E293B" }}>
                {project.title}
              </h3>
              <p className="text-sm mb-3" style={{ color: "#3F7A89" }}>
                {project.location} • {project.year}
              </p>
              <p className="body-sm">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
