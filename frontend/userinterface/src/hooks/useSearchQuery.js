import { useCallback, useEffect, useState } from 'react'

const readQueryFromUrl = () =>
  new URLSearchParams(window.location.search).get('q') ?? ''

// Owns the search text and keeps it in sync with the browser URL (?q=...),
// including the browser Back/Forward buttons.
export function useSearchQuery() {
  const [query, setQuery] = useState(readQueryFromUrl)

  // Back / Forward button -> update the text
  useEffect(() => {
    const syncQuery = () => setQuery(readQueryFromUrl())
    window.addEventListener('popstate', syncQuery)
    return () => window.removeEventListener('popstate', syncQuery)
  }, [])

  // Called when the search form is submitted (Enter / search icon)
  const commitSearch = useCallback(() => {
    const trimmed = query.trim()
    const nextUrl = trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/'
    window.history.pushState({}, '', nextUrl)
    setQuery(trimmed)
  }, [query])

  // Called by "Clear filters"
  const clearSearch = useCallback(() => {
    setQuery('')
    window.history.pushState({}, '', '/')
  }, [])

  return { query, setQuery, commitSearch, clearSearch }
}
