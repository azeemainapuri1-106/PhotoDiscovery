import { USE_MOCK } from '../config/env'
import { mockCategories } from '../data/categories'
import { apiClient } from './apiClient'

export const categoryService = {
  /**
   * Backend contract (suggested):
   *   GET /api/categories
   *   -> 200 [ "Nature", "Interiors", ... ]   (array of names)
   *      (if you return objects like { id, name }, map them to names here)
   */
  async getCategories({ signal } = {}) {
    if (USE_MOCK) return mockCategories

    const data = await apiClient.get('/categories', { signal })
    return data.map((item) => (typeof item === 'string' ? item : item.name))
  },
}
