import axios from 'axios'
import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/env'

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: 'application/json' },
})

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function notifyUnauthorized(url = '') {
  if (/\/auth\/(login|register|google)(?:\?|$)/.test(url)) return
  localStorage.removeItem(AUTH_TOKEN_KEY)
  window.dispatchEvent(new Event('photodiscovery:unauthorized'))
}

axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (axios.isCancel(error) || error.code === 'ERR_CANCELED') {
      return Promise.reject(new DOMException('The request was aborted.', 'AbortError'))
    }

    if (!error.response) {
      return Promise.reject(new ApiError(
        'Unable to reach the server. Check your connection and try again.',
        0,
        null,
      ))
    }

    const { status, data } = error.response
    if (status === 401) notifyUnauthorized(error.config?.url)
    return Promise.reject(new ApiError(
      data?.message || `The server could not complete the request (${status}).`,
      status,
      data,
    ))
  },
)

export const apiClient = {
  get: (path, options) => axiosClient.get(path, options),
  post: (path, body, options) => axiosClient.post(path, body, options),
  put: (path, body, options) => axiosClient.put(path, body, options),
  patch: (path, body, options) => axiosClient.patch(path, body, options),
  delete: (path, options) => axiosClient.delete(path, options),
}
