import { USE_MOCK } from '../config/env'
import { mockPhotos } from '../data/photos'
import { apiClient } from './apiClient'

// Converts whatever the backend sends into the shape the UI expects.
// If your Spring Boot DTO uses different field names (e.g. imageUrl), fix it HERE
// and no component needs to change.
function normalizePhoto(dto) {
  return {
    id: dto.id,
    title: dto.title,
    photographer: dto.photographer,
    category: dto.category,
    image: dto.image ?? dto.imageUrl,
    ratio: dto.ratio ?? 'portrait',
  }
}

// Mock version of server-side search/filtering.
function filterMockPhotos({ query, category }) {
  const normalizedQuery = (query ?? '').trim().toLowerCase()
  return mockPhotos.filter((photo) => {
    const matchesCategory = !category || photo.category === category
    const matchesSearch =
      !normalizedQuery ||
      `${photo.title} ${photo.photographer} ${photo.category}`
        .toLowerCase()
        .includes(normalizedQuery)
    return matchesCategory && matchesSearch
  })
}

export const photoService = {
  /**
   * Get photos, optionally filtered.
   *
   * Backend contract (suggested for Spring Boot):
   *   GET /api/photos?q=<text>&category=<name>
   *   -> 200 [ { id, title, photographer, category, image, ratio }, ... ]
   *
   * @param {{ query?: string, category?: string, signal?: AbortSignal }} options
   *   category = undefined means "all categories"
   */
  async getPhotos({ query, category, signal } = {}) {
    if (USE_MOCK) return filterMockPhotos({ query, category })

    const data = await apiClient.get('/photos', {
      params: { q: query, category },
      signal,
    })
    return data.map(normalizePhoto)
  },

  /**
   * Get photos by ids (useful later for a "Saved" page).
   * Backend: GET /api/photos?ids=1,2,3   (not used by the UI yet)
   */
  async getPhotosByIds(ids, { signal } = {}) {
    if (USE_MOCK) return mockPhotos.filter((photo) => ids.includes(photo.id))

    const data = await apiClient.get('/photos', {
      params: { ids: ids.join(',') },
      signal,
    })
    return data.map(normalizePhoto)
  },
}
