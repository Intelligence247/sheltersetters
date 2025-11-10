'use client'

import React from 'react'
import { Layers3, Newspaper, Sparkles, UsersRound } from 'lucide-react'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ServiceManager } from '@/components/admin/content/service-manager'
import { NewsManager } from '@/components/admin/content/news-manager'
import { ProjectManager } from '@/components/admin/content/project-manager'
import { TeamManager } from '@/components/admin/content/team-manager'
import { RoleGate } from '@/components/admin/role-gate'

export default function AdminContentDashboard() {
  return (
    <RoleGate allowed={['super_admin', 'content_manager']}>
      <div className="space-y-6">
      <Card className="border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <CardTitle className="text-[#0E293B] dark:text-white">Content management</CardTitle>
            <CardDescription className="text-sm text-slate-500 dark:text-slate-400">
              Curate the stories, services, and project showcases that power the public Shelter Setters website.
            </CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#BD5A00]/30 px-3 py-1 text-xs uppercase tracking-[0.35em] text-[#BD5A00]">
            Governed access
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="services" className="mt-2">
            <TabsList>
              <TabsTrigger value="services">
                <Layers3 className="h-4 w-4" />
                Services
              </TabsTrigger>
              <TabsTrigger value="news">
                <Newspaper className="h-4 w-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="projects">
                <Sparkles className="h-4 w-4" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="team">
                <UsersRound className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>

            <TabsContent value="services" className="pt-6">
              <ServiceManager />
            </TabsContent>

            <TabsContent value="news" className="pt-6">
              <NewsManager />
            </TabsContent>

            <TabsContent value="projects" className="pt-6">
              <ProjectManager />
            </TabsContent>

            <TabsContent value="team" className="pt-6">
              <TeamManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </RoleGate>
  )
}

