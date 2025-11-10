export type AdminRole = 'super_admin' | 'content_manager' | 'customer_care'

export interface AdminProfile {
  _id: string
  name: string
  email: string
  role: AdminRole
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastLoginAt?: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  token: string
  admin: AdminProfile
}

