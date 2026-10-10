import { useRef } from 'react'
import { SearchIcon } from '../common/Icons'
import { useFocusShortcut } from '../../hooks'
import './SearchBar.css'

// Search form. Pressing "/" anywhere on the page focuses the input.
export default function SearchBar({ query, onQueryChange, onSubmit }) {
  const inputRef = useRef(null)
  useFocusShortcut(inputRef, '/')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form className="search-form" role="search" onSubmit={handleSubmit}>
      <button className="search-form__submit" type="submit" aria-label="Search">
        <SearchIcon />
      </button>
      <input
        ref={inputRef}
        aria-label="Search photos"
        type="search"
        placeholder="Search for anything"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
      />
      <kbd className="search-form__shortcut" aria-hidden="true">
        /
      </kbd>
    </form>
  )
}
