import { AUTH_TOKEN_KEY } from '../config/env'
import { apiClient } from './apiClient'

function saveToken(token) {
  if (!token) throw new Error('The server did not return an access token.')
  localStorage.setItem(AUTH_TOKEN_KEY, token)
}

export const authService = {
  async login({ email, password }) {
    const data = await apiClient.post('/auth/login', { email, password })
    saveToken(data.token)
    return data.user
  },

  async register({ name, email, password }) {
    const data = await apiClient.post('/auth/register', { name, email, password })
    saveToken(data.token)
    return data.user
  },

  async googleLogin(idToken) {
    const data = await apiClient.post('/auth/google', { idToken })
    saveToken(data.token)
    return data.user
  },

  async getCurrentUser({ signal } = {}) {
    return apiClient.get('/auth/me', { signal })
  },

  logout() {
    localStorage.removeItem(AUTH_TOKEN_KEY)
  },
}
