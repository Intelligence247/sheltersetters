export type ContactStatus = 'new' | 'in_progress' | 'closed'

export interface ContactMessage {
  _id: string
  name: string
  email: string
  phone?: string
  message: string
  status: ContactStatus
  respondedAt?: string | null
  repliedAt?: string | null
  repliedBy?: string | null
  reply?: string | null
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface ContactPagination {
  total: number
  page: number
  limit: number
  pages: number
}

export interface ContactListResult {
  messages: ContactMessage[]
  pagination: ContactPagination
}

