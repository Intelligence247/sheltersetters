export interface ApiResponse<T> {
  status?: string
  statusCode?: number
  message: string
  data: T
}

