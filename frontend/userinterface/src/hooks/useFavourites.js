import { useCallback, useEffect, useState } from 'react'
import { favouriteService } from '../services'

// Keeps the list of favourite photo ids.
// The heart updates instantly ("optimistic update"); if the server call fails
// we undo the change so the UI never lies about what was saved.
export function useFavourites() {
  const [favouriteIds, setFavouriteIds] = useState([])

  // Load saved favourites once (empty in mock mode)
  useEffect(() => {
    const controller = new AbortController()

    favouriteService
      .getFavouriteIds({ signal: controller.signal })
      .then(setFavouriteIds)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Could not load favourites', err)
      })

    return () => controller.abort()
  }, [])

  const toggleFavourite = useCallback(
    (photoId) => {
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

      request.catch((err) => {
        console.error('Could not update favourite', err)
        setFavouriteIds((current) =>
          wasFavourite
            ? [...current, photoId]
            : current.filter((id) => id !== photoId),
        )
      })
    },
    [favouriteIds],
  )

  return { favouriteIds, toggleFavourite }
}
