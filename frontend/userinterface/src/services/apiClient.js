import { API_BASE_URL, AUTH_TOKEN_KEY } from '../config/env'

// A small wrapper around fetch. Every service uses this, so things like the
// base URL, JSON handling, auth header and error handling live in ONE place.

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status // HTTP status code, e.g. 404
    this.data = data // parsed error body from the server (if any)
  }
}

function getToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  } catch {
    return null
  }
}

function buildUrl(path, params) {
  const url = `${API_BASE_URL}${path}`
  if (!params) return url

  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    // skip empty values so we never send "?q=" or "?category=undefined"
    if (value !== undefined && value !== null && value !== '') {
      search.append(key, value)
    }
  })
  const queryString = search.toString()
  return queryString ? `${url}?${queryString}` : url
}

async function request(method, path, { params, body, signal } = {}) {
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  // Attach the JWT (or similar) once the user is logged in.
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal, // lets us cancel the request (see usePhotos)
  })

  // 204 No Content (typical for DELETE) has no body to parse
  const hasBody = response.status !== 204
  const data = hasBody ? await response.json().catch(() => null) : null

  if (!response.ok) {
    throw new ApiError(
      data?.message || `Request failed with status ${response.status}`,
      response.status,
      data,
    )
  }

  return data
}

export const apiClient = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  put: (path, body, options) => request('PUT', path, { ...options, body }),
  patch: (path, body, options) => request('PATCH', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
}
