import { USE_MOCK } from '../config/env'
import { apiClient } from './apiClient'

// In mock mode favourites only live in React state (same as the original app),
// so these functions simply resolve. With a real backend they persist per user.
//
// Backend contract (suggested, requires the user to be logged in):
//   GET    /api/favourites          -> 200 [ photoId, photoId, ... ]
//   POST   /api/favourites/{id}     -> 201/204
//   DELETE /api/favourites/{id}     -> 204

export const favouriteService = {
  async getFavouriteIds({ signal } = {}) {
    if (USE_MOCK) return []
    return apiClient.get('/favourites', { signal })
  },

  async addFavourite(photoId) {
    if (USE_MOCK) return
    await apiClient.post(`/favourites/${photoId}`)
  },

  async removeFavourite(photoId) {
    if (USE_MOCK) return
    await apiClient.delete(`/favourites/${photoId}`)
  },
}
