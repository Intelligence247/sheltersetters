"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { API_BASE_URL } from "@/lib/config"
import { Skeleton } from "@/components/ui/skeleton"
import type { Project } from "@/types/content"

interface ProjectsResponse {
  statusCode: number
  message: string
  data?: {
    projects?: Project[]
  }
}

const FALLBACK_PROJECTS = [
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
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchProjects = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/content/projects`, {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch projects")
        }

        const payload: ProjectsResponse = await response.json()
        const fetchedProjects = payload?.data?.projects ?? []

        if (!isMounted) return

        if (fetchedProjects.length > 0) {
          // Sort by order, then by createdAt (newest first)
          const sortedProjects = fetchedProjects.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
              return a.order - b.order
            }
            const dateA = new Date(a.createdAt).getTime()
            const dateB = new Date(b.createdAt).getTime()
            return dateB - dateA
          })
          setProjects(sortedProjects)
        } else {
          setProjects([])
        }
      } catch (err: any) {
        // Ignore abort errors
        if (err.name === "AbortError") {
          return
        }
        if (!isMounted) return

        console.error("Failed to load projects", err)
        setError("Unable to load projects at the moment.")
        setProjects([])
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProjects()

    return () => {
      isMounted = false
      if (!controller.signal.aborted) {
        controller.abort()
      }
    }
  }, [])

  // Use fallback projects if no projects are loaded
  const displayProjects = projects.length > 0 ? projects : (loading ? [] : FALLBACK_PROJECTS)

  return (
    <section className="section-py projects-section" id="projects">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Featured Projects</h2>
          <p className="body-lg mx-auto max-w-2xl projects-subtitle">
            Showcasing excellence across residential, commercial, and industrial sectors
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="card projects-card overflow-hidden">
                <Skeleton className="projects-image mb-4 h-48 w-full rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6 mt-2" />
              </div>
            ))}
          </div>
        ) : displayProjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {displayProjects.map((project) => {
              // Handle both API projects and fallback projects
              const isApiProject = "_id" in project
              const title = isApiProject ? project.title : (project as any).title
              const location = isApiProject ? project.location : (project as any).location
              const year = isApiProject && project.completedAt
                ? format(new Date(project.completedAt), "yyyy")
                : (project as any).year || new Date().getFullYear().toString()
              const description = isApiProject ? project.summary : (project as any).description
              const image = isApiProject ? (project.imageUrl || "/placeholder.svg") : (project as any).image
              const alt = isApiProject
                ? `${project.title} - ${project.location || "Project"}`
                : (project as any).alt || project.title

              return (
                <div key={isApiProject ? project._id : title} className="card projects-card group overflow-hidden">
                  <div className="projects-image relative mb-4 h-48 overflow-hidden rounded-lg">
                    <img
                      src={image}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="projects-title mb-2 text-lg font-bold">{title}</h3>
                  <p className="projects-meta mb-3 text-sm">
                    {location && `${location} • `}{year}
                  </p>
                  <p className="projects-text body-sm">{description}</p>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="body-base" style={{ color: "var(--text-secondary)" }}>
              {error || "No featured projects available at the moment."}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
