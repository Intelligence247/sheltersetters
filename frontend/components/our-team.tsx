"use client"

import { useState, useEffect } from "react"
import { API_BASE_URL } from "@/lib/config"
import { Skeleton } from "@/components/ui/skeleton"

interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  imageUrl?: string
  alt?: string
}

interface TeamMemberApi {
  _id?: string
  id?: string | number
  name: string
  role: string
  bio?: string
  imageUrl?: string
  altText?: string
}

interface TeamApiResponse {
  statusCode: number
  message: string
  data?: {
    team?: TeamMemberApi[]
  }
}

const FALLBACK_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Dr. Hassan Ibrahim Sani",
    role: "MD/CEO",
    alt: "Portrait of Dr. Hassan Ibrahim Sani MD/CEO of Shelter Setters",
    imageUrl: "/ceo.png",
  },
  {
    id: "2",
    name: "Ariyo Ojo Tosin",
    role: "Human Resource Manager",
    alt: "Portrait of Ariyo Ojo Tosin Human Resource Manager",
    imageUrl: "/ariyo.png",
  },
  {
    id: "3",
    name: "Winner Kelechi N.",
    role: "Management Consultant",
    alt: "Portrait of Winner Kelechi N. Management Consultant",
    imageUrl: "/winner.png",
  },
  {
    id: "4",
    name: "Aliy Ibrahim",
    role: "Director",
    alt: "Portrait of Aliy Ibrahim Director",
    imageUrl: "/default.png",
  },
  {
    id: "5",
    name: "Hamzah Ibrahim",
    role: "Director",
    alt: "Portrait of Hamzah Ibrahim Director",
    imageUrl: "/default.png",
  },
  {
    id: "6",
    name: "Habeeb Hamisu",
    role: "General Manager",
    alt: "Portrait of Habeeb Hamisu General Manager",
    imageUrl: "/default.png",
  },
]

export default function OurTeam() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const loadTeam = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_BASE_URL}/api/content/team`, {
          signal: controller.signal,
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error("Failed to fetch team members")
        }

        const payload: TeamApiResponse = await response.json()
        const team = payload?.data?.team ?? []

        const formattedTeam: TeamMember[] = team.map((item, index) => {
          const id = String(item._id ?? item.id ?? index)
          const altText = item.altText || `Portrait of ${item.name}, ${item.role}`

          return {
            id,
            name: item.name,
            role: item.role,
            bio: item.bio,
            imageUrl: item.imageUrl || "/default.png",
            alt: altText,
          }
        })

        if (!formattedTeam.length) {
          setTeamMembers(FALLBACK_TEAM)
        } else {
          setTeamMembers(formattedTeam)
        }
      } catch (err) {
        console.error("Failed to load team members", err)
        setError("Unable to load team members at the moment.")
        setTeamMembers(FALLBACK_TEAM)
      } finally {
        setLoading(false)
      }
    }

    loadTeam()

    return () => {
      controller.abort()
    }
  }, [])

  return (
    <section className="section-py team-section">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="heading-lg mb-4">Our Leadership Team</h2>
          <p className="body-lg mx-auto max-w-2xl team-subtitle">
            Experienced professionals driving excellence in aluminium fabrication and construction
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="team-card text-center">
                <div className="team-image relative mb-6 h-64 overflow-hidden rounded-2xl">
                  <Skeleton className="h-full w-full rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-5 w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {teamMembers.map((member) => (
                <div key={member.id} className="team-card text-center">
                  <div className="team-image relative mb-6 h-64 overflow-hidden rounded-2xl">
                    <img
                      src={member.imageUrl || "/default.png"}
                      alt={member.alt || `Portrait of ${member.name}, ${member.role}`}
                      className="h-full w-full rounded-2xl object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h3 className="team-name mb-1 text-xl font-bold">{member.name}</h3>
                  <p className="team-role font-medium">{member.role}</p>
                  {member.bio && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{member.bio}</p>
                  )}
                </div>
              ))}
            </div>
            {error && (
              <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">{error}</p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
