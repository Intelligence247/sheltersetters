export type AdminRole = 'admin' | 'editor' | 'viewer'

export interface AdminProfile {
  _id: string
  name: string
  email: string
  role: AdminRole
  isActive: boolean
  createdAt: string
  updatedAt: string
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

