import { useEffect, useState } from 'react'
import { DEFAULT_CATEGORY } from '../constants'
import { categoryService } from '../services'

// Loads category names and puts "For you" first.
// While loading (or if the request fails) only "For you" is shown, so the
// page never breaks.
export function useCategories() {
  const [names, setNames] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    categoryService
      .getCategories({ signal: controller.signal })
      .then(setNames)
      .catch((err) => {
        if (err.name !== 'AbortError') console.error('Could not load categories', err)
      })

    return () => controller.abort()
  }, [])

  return [DEFAULT_CATEGORY, ...names]
}
