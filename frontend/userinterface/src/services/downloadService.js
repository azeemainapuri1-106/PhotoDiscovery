import { apiClient } from './apiClient'

export const downloadService = {
  async download(photo) {
    const response = await apiClient.post(
      `/photos/${encodeURIComponent(photo.id)}/download`,
    )
    const imageUrl = new URL(response.downloadUrl)
    if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== 'images.unsplash.com') {
      throw new Error('The server returned an invalid download URL.')
    }

    let imageResponse
    try {
      imageResponse = await fetch(imageUrl)
    } catch {
      throw new Error('The photo could not be downloaded. Please try again.')
    }
    if (!imageResponse.ok) {
      throw new Error('The photo could not be downloaded. Please try again.')
    }

    const blob = await imageResponse.blob()
    const objectUrl = URL.createObjectURL(blob)
    const filenamePart = (value) => String(value)
      .normalize('NFKD')
      .replace(/[^\w.-]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 80) || 'photo'
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = `photo-${filenamePart(photo.id)}-by-${filenamePart(photo.photographer)}.jpg`
    document.body.appendChild(anchor)
    anchor.click()
    anchor.remove()
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    return response
  },
}
