import { useEffect, useState } from 'react'

// Returns `value`, but only after it has stopped changing for `delay` ms.
// Example: typing "mountain" fires ONE search instead of eight.
export function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
