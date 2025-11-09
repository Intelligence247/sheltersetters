'use client'

import { API_BASE_URL } from '@/lib/config'

export interface RequestOptions extends RequestInit {
  auth?: {
    accessToken: string | null
    refresh: () => Promise<string | null>
  }
}

export class ApiError extends Error {
  status: number
  body: unknown

  constructor(status: number, message: string, body: unknown) {
    super(message)
    this.status = status
    this.body = body
  }
}

const handleRefreshAndRetry = async (
  input: RequestInfo | URL,
  init: RequestInit,
  opts: RequestOptions
): Promise<Response> => {
  if (!opts.auth) throw new ApiError(401, 'Unauthorized', null)

  const newAccessToken = await opts.auth.refresh()
  if (!newAccessToken) {
    throw new ApiError(401, 'Unable to refresh session', null)
  }

  const retryHeaders = new Headers(init.headers || {})
  retryHeaders.set('Authorization', `Bearer ${newAccessToken}`)

  const retryResponse = await fetch(input, {
    ...init,
    headers: retryHeaders,
  })

  if (!retryResponse.ok) {
    throw new ApiError(retryResponse.status, retryResponse.statusText, await safeJson(retryResponse))
  }

  return retryResponse
}

const safeJson = async (response: Response) => {
  const text = await response.text()
  try {
    return text ? JSON.parse(text) : null
  } catch (error) {
    return text
  }
}

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  const headers = new Headers(options.headers || {})

  if (!headers.has('Content-Type') && options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.auth?.accessToken) {
    headers.set('Authorization', `Bearer ${options.auth.accessToken}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  })

  if (response.ok) {
    return (await safeJson(response)) as T
  }

  if (response.status === 401 && options.auth?.refresh) {
    const retried = await handleRefreshAndRetry(
      url,
      {
        ...options,
        headers,
      },
      options
    )
    return (await safeJson(retried)) as T
  }

  throw new ApiError(response.status, response.statusText, await safeJson(response))
}

