import type { ApiResponse } from '@/types/api'

interface UploadOptions {
  folder?: string
}

interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  format?: string
  bytes?: number
}

type AuthenticatedRequest = <T = unknown>(path: string, init?: RequestInit) => Promise<T>

export const uploadAdminImage = async (
  request: AuthenticatedRequest,
  file: File,
  options: UploadOptions = {}
): Promise<UploadResult> => {
  const formData = new FormData()
  formData.append('file', file)
  if (options.folder) {
    formData.append('folder', options.folder)
  }

  const response = await request<ApiResponse<UploadResult>>('/api/uploads', {
    method: 'POST',
    body: formData,
  })

  return response.data
}

