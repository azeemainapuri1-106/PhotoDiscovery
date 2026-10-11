import { apiClient } from './apiClient'

export const categoryService = {
  async getCategories({ signal } = {}) {
    const data = await apiClient.get('/categories', { signal })
    return data.map((item) => (typeof item === 'string' ? item : item.name))
  },
}
