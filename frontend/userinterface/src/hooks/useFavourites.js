import { useCallback, useEffect, useState } from 'react'
import { favouriteService } from '../services'

// Keeps the list of favourite photo ids.
// The heart updates instantly ("optimistic update"); if the server call fails
// we undo the change so the UI never lies about what was saved.
export function useFavourites(userId) {
  const [favouriteIds, setFavouriteIds] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    setFavouriteIds([])
    setError(null)
    if (!userId) return undefined

    const controller = new AbortController()

    favouriteService
      .getFavouriteIds({ signal: controller.signal })
      .then((ids) => setFavouriteIds(ids.map(String)))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })

    return () => controller.abort()
  }, [userId])

  const toggleFavourite = useCallback(
    async (photoId) => {
      photoId = String(photoId)
      const wasFavourite = favouriteIds.includes(photoId)

      // 1) update the screen right away
      setFavouriteIds((current) =>
        wasFavourite
          ? current.filter((id) => id !== photoId)
          : [...current, photoId],
      )

      // 2) tell the server; 3) roll back if it fails
      const request = wasFavourite
        ? favouriteService.removeFavourite(photoId)
        : favouriteService.addFavourite(photoId)

      try {
        await request
        setError(null)
      } catch (err) {
        setError(err)
        setFavouriteIds((current) =>
          wasFavourite
            ? [...current, photoId]
            : current.filter((id) => id !== photoId),
        )
      }
    },
    [favouriteIds],
  )

  return { favouriteIds, toggleFavourite, error }
}
