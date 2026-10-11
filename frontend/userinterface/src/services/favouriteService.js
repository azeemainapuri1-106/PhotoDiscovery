import { apiClient } from './apiClient'

export const favouriteService = {
  getFavouriteIds({ signal } = {}) {
    return apiClient.get('/favourites', { signal })
  },

  addFavourite(photoId) {
    return apiClient.post(`/favourites/${encodeURIComponent(photoId)}`)
  },

  removeFavourite(photoId) {
    return apiClient.delete(`/favourites/${encodeURIComponent(photoId)}`)
  },
}
