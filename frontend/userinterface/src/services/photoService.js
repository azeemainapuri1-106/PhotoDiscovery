import { apiClient } from './apiClient'

function normalizePhoto(dto) {
  return {
    id: String(dto.id),
    title: dto.title,
    photographer: dto.photographer,
    category: dto.category,
    photographerUrl: dto.photographerUrl,
    image: dto.image ?? dto.imageUrl,
    ratio: dto.ratio ?? (dto.height >= dto.width ? 'portrait' : 'landscape'),
    width: dto.width,
    height: dto.height,
  }
}

export const photoService = {
  async getPhotos({ query, category, signal, page = 0, perPage = 20 } = {}) {
    const normalizedQuery = (query ?? '').trim()
    const endpoint = normalizedQuery ? '/photos/search' : '/photos'
    const data = await apiClient.get(endpoint, {
      params: {
        q: normalizedQuery || undefined,
        category,
        page,
        perPage,
      },
      signal,
    })
    return data.map(normalizePhoto)
  },

  async getPhoto(photoId, { signal } = {}) {
    const data = await apiClient.get(`/photos/${encodeURIComponent(photoId)}`, { signal })
    return normalizePhoto(data)
  },
}
