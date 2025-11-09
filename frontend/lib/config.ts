'use client'

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050'

export const STORAGE_KEYS = {
  accessToken: 'sheltersetters.admin.accessToken',
  refreshToken: 'sheltersetters.admin.refreshToken',
  adminProfile: 'sheltersetters.admin.profile',
}

