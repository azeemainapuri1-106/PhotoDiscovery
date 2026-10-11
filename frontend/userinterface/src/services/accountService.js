import { apiClient } from './apiClient'

export const accountService = {
  getQuota({ signal } = {}) {
    return apiClient.get('/downloads/quota', { signal })
  },

  getHistory({ signal } = {}) {
    return apiClient.get('/downloads/history', { signal })
  },
}
