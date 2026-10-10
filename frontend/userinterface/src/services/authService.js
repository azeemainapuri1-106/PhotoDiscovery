import { AUTH_TOKEN_KEY, USE_MOCK } from '../config/env'
import { apiClient } from './apiClient'

// Ready for when login/sign-up goes live. The UI (AuthDialog) is still a
// "coming soon" message and does not call these yet.
//
// Backend contract (suggested):
//   POST /api/auth/register  { name, email, password } -> 201 { token, user }
//   POST /api/auth/login     { email, password }       -> 200 { token, user }
//   GET  /api/auth/me                                  -> 200 { id, name, email }

function saveToken(token) {
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  } catch {
    /* storage blocked - ignore */
  }
}

export const authService = {
  async login({ email, password }) {
    if (USE_MOCK) throw new Error('Login is not available in mock mode yet.')
    const data = await apiClient.post('/auth/login', { email, password })
    saveToken(data.token)
    return data.user
  },

  async register({ name, email, password }) {
    if (USE_MOCK) throw new Error('Sign up is not available in mock mode yet.')
    const data = await apiClient.post('/auth/register', { name, email, password })
    saveToken(data.token)
    return data.user
  },

  async getCurrentUser({ signal } = {}) {
    if (USE_MOCK) return null
    return apiClient.get('/auth/me', { signal })
  },

  logout() {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    } catch {
      /* storage blocked - ignore */
    }
  },
}
