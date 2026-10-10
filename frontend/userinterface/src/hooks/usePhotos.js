import { useCallback, useEffect, useState } from 'react'
import { SEARCH_DEBOUNCE_MS } from '../config/env'
import { DEFAULT_CATEGORY } from '../constants'
import { photoService } from '../services'
import { useDebounce } from './useDebounce'

// Loads photos for the current search text + category.
//
// Returns:
//   photos   - array of photos (previous results stay visible while reloading)
//   status   - 'loading' | 'success' | 'error'
//   error    - Error object when status === 'error'
//   refetch  - call to try again
export function usePhotos({ query, category }) {
  const [photos, setPhotos] = useState([])
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)
  const [reloadKey, setReloadKey] = useState(0)

  // wait until the user stops typing before hitting the API
  const debouncedQuery = useDebounce(query, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    // AbortController cancels an old request if a newer one starts,
    // so slow old responses can never overwrite fresh ones.
    const controller = new AbortController()
    setStatus('loading')

    photoService
      .getPhotos({
        query: debouncedQuery,
        category: category === DEFAULT_CATEGORY ? undefined : category,
        signal: controller.signal,
      })
      .then((data) => {
        setPhotos(data)
        setError(null)
        setStatus('success')
      })
      .catch((err) => {
        if (err.name === 'AbortError') return // cancelled on purpose
        setError(err)
        setStatus('error')
      })

    return () => controller.abort()
  }, [debouncedQuery, category, reloadKey])

  const refetch = useCallback(() => setReloadKey((key) => key + 1), [])

  return { photos, status, error, refetch }
}
