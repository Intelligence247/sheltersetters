'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Building2, CalendarDays, MapPin, Sparkles, Users } from 'lucide-react'

import { useAuth } from '@/components/admin/auth-context'
import type { ApiResponse } from '@/types/api'
import type { Project, TeamMember } from '@/types/content'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

interface ProjectListResponse {
  projects: Project[]
}

interface TeamListResponse {
  members: TeamMember[]
}

interface ProjectItemResponse {
  project: Project
}

interface TeamItemResponse {
  member: TeamMember
}

export default function AdminTeamProjectsDashboard() {
  const { request } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingTeam, setLoadingTeam] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingProjects(true)
        const projectRes = await request<ApiResponse<ProjectListResponse>>('/api/admin/content/projects')
        setProjects(projectRes.data.projects)
      } catch (error: any) {
        toast.error('Unable to load projects', {
          description: error?.body?.message || 'Please try again shortly.',
        })
      } finally {
        setLoadingProjects(false)
      }

      try {
        setLoadingTeam(true)
        const teamRes = await request<ApiResponse<TeamListResponse>>('/api/admin/content/team')
        setTeam(teamRes.data.members)
      } catch (error: any) {
        toast.error('Unable to load team members', {
          description: error?.body?.message || 'Please try again shortly.',
        })
      } finally {
        setLoadingTeam(false)
      }
    }

    loadData()
  }, [request])

  const featureCounts = useMemo(() => {
    const featuredProjects = projects.filter((project) => project.isFeatured).length
    const activeTeam = team.filter((member) => member.isActive).length
    return {
      featuredProjects,
      totalProjects: projects.length,
      activeTeam,
      totalTeam: team.length,
    }
  }, [projects, team])

  const orderedProjects = useMemo(
    () => [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [projects]
  )

  const orderedTeam = useMemo(
    () => [...team].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    [team]
  )

  const toggleProjectFeatured = async (project: Project, value: boolean) => {
    try {
      const response = await request<ApiResponse<ProjectItemResponse>>(
        `/api/admin/content/projects/${project._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ isFeatured: value }),
        }
      )
      setProjects((prev) =>
        prev.map((item) => (item._id === project._id ? response.data.project : item))
      )
      toast.success(value ? 'Project featured' : 'Project archived', {
        description: `${project.title} ${value ? 'is highlighted on the site.' : 'is hidden from the spotlight.'}`,
      })
    } catch (error: any) {
      toast.error('Unable to update project', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  const toggleTeamActive = async (member: TeamMember, value: boolean) => {
    try {
      const response = await request<ApiResponse<TeamItemResponse>>(`/api/admin/content/team/${member._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ isActive: value }),
      })
      setTeam((prev) => prev.map((item) => (item._id === member._id ? response.data.member : item)))
      toast.success(value ? 'Profile published' : 'Profile hidden', {
        description: `${member.name} ${value ? 'is now visible on the team section.' : 'has been hidden from the public site.'}`,
      })
    } catch (error: any) {
      toast.error('Unable to update team member', {
        description: error?.body?.message || 'Please try again.',
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm uppercase tracking-[0.3em] text-[#BD5A00]">Projects</CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Featured builds and signature installations.
              </CardDescription>
            </div>
            <Sparkles className="h-6 w-6 text-[#BD5A00]" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-semibold text-[#0E293B] dark:text-white">{featureCounts.featuredProjects}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Featured projects live</p>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              {featureCounts.totalProjects} total projects
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm uppercase tracking-[0.3em] text-[#BD5A00]">Team</CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Active leadership and management profiles.
              </CardDescription>
            </div>
            <Users className="h-6 w-6 text-[#BD5A00]" />
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <div>
              <p className="text-4xl font-semibold text-[#0E293B] dark:text-white">{featureCounts.activeTeam}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Team members visible</p>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">{featureCounts.totalTeam} total members</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
                <Building2 className="h-5 w-5 text-[#BD5A00]" />
                Project portfolio
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Control which projects appear on the public carousel.
              </CardDescription>
            </div>
            <Button asChild variant="outline" className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">
              <Link href="/admin/content">Manage content</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right">Completed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loadingProjects && orderedProjects.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                      No projects available yet.
                    </TableCell>
                  </TableRow>
                )}
                {loadingProjects && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading projects…
                    </TableCell>
                  </TableRow>
                )}
                {orderedProjects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#0E293B] dark:text-white">{project.title}</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{project.summary}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {project.category ?? '-'}
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">
                      {project.location ? (
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#BD5A00]" /> {project.location}
                        </span>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={project.isFeatured}
                        onCheckedChange={(value) => toggleProjectFeatured(project, value)}
                      />
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500 dark:text-slate-400">
                      {project.completedAt ? (
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="h-3 w-3 text-[#BD5A00]" />
                          {new Date(project.completedAt).toLocaleDateString()}
                        </span>
                      ) : (
                        'Ongoing'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-[#0E293B] dark:text-white">
                <Users className="h-5 w-5 text-[#BD5A00]" />
                Leadership roster
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
                Toggle visibility of leadership profiles in real time.
              </CardDescription>
            </div>
            <Button asChild variant="outline" className="text-xs uppercase tracking-[0.3em] text-[#BD5A00]">
              <Link href="/admin/content?tab=team">Manage team</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-center">Visible</TableHead>
                  <TableHead className="text-right">Order</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!loadingTeam && orderedTeam.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-slate-500 dark:text-slate-400">
                      No team members recorded yet.
                    </TableCell>
                  </TableRow>
                )}
                {loadingTeam && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading team members…
                    </TableCell>
                  </TableRow>
                )}
                {orderedTeam.map((member) => (
                  <TableRow key={member._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          {member.imageUrl ? (
                            <AvatarImage src={member.imageUrl} alt={member.name} />
                          ) : (
                            <AvatarFallback className="bg-[#0E293B]/10 text-[#0E293B]">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-[#0E293B] dark:text-white">{member.name}</span>
                          {member.bio && (
                            <span className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                              {member.bio}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-slate-500 dark:text-slate-400">{member.role}</TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={member.isActive}
                        onCheckedChange={(value) => toggleTeamActive(member, value)}
                      />
                    </TableCell>
                    <TableCell className="text-right text-xs text-slate-500 dark:text-slate-400">
                      {member.order ?? '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

