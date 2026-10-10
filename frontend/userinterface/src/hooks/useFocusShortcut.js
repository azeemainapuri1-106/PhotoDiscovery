import { useEffect } from 'react'

// Press a key (default "/") anywhere on the page to focus the given input,
// unless the user is already typing in a field.
export function useFocusShortcut(inputRef, key = '/') {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isEditing =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))

      if (event.key === key && !isEditing) {
        event.preventDefault()
        inputRef.current?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [inputRef, key])
}
