export interface DashboardMetrics {
  enquiries: {
    open: number
    total: number
  }
  team: {
    active: number
    total: number
  }
  projects: {
    live: number
    total: number
  }
  services: {
    active: number
    total: number
  }
  news: {
    published: number
  }
}

export interface DashboardMessageSummary {
  _id: string
  name: string
  email: string
  status: 'new' | 'in_progress' | 'closed'
  message: string
  createdAt: string
}

export interface DashboardOverview {
  metrics: DashboardMetrics
  recentMessages: DashboardMessageSummary[]
}

