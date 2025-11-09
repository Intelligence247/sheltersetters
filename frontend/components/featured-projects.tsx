"use client"

const projects = [
  {
    title: "Residential Complex Roofing",
    location: "Ilorin, Kwara State",
    year: "2024",
    alt: "Shelter Setters completed residential roofing project with modern aluminium design",
    description: "Complete roofing installation using premium aluminium sheets",
    image: "/residential.png",
  },
  {
    title: "Commercial Office Fitout",
    location: "Lagos, Nigeria",
    year: "2023",
    alt: "Completed aluminium window and glass partitioning installation for commercial office building",
    description: "Glass partitioning and aluminium window systems",
    image: "/glass-house.png",
  },
  {
    title: "Industrial Facility Renovation",
    location: "Kaduna Industrial Estate",
    year: "2023",
    alt: "Industrial aluminium roofing and cladding solution for factory",
    description: "Large-scale roofing and cladding project",
    image: "/cladding.png",
  },
  {
    title: "Luxury Residential Build",
    location: "Abuja, Nigeria",
    year: "2024",
    alt: "High-end residential project featuring custom aluminium facades and window systems",
    description: "Premium architectural aluminium solutions",
    image: "/glass-partition.png",

  },
]

export default function FeaturedProjects() {
  return (
    <section className="section-py projects-section" id="projects">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Featured Projects</h2>
          <p className="body-lg mx-auto max-w-2xl projects-subtitle">
            Showcasing excellence across residential, commercial, and industrial sectors
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <div key={project.title} className="card projects-card group overflow-hidden">
              <div className="projects-image relative mb-4 h-48 overflow-hidden rounded-lg">
                <img
                  src={project.image}
                  alt={project.alt}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="projects-title mb-2 text-lg font-bold">{project.title}</h3>
              <p className="projects-meta mb-3 text-sm">
                {project.location} • {project.year}
              </p>
              <p className="projects-text body-sm">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
