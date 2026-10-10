import Logo from '../common/Logo'
import SearchBar from './SearchBar'
import HeaderActions from './HeaderActions'
import './Header.css'

// Sticky top bar: logo | search | saved / log in / sign up.
// Purely presentational - all state and handlers come from App via props.
export default function Header({
  query,
  onQueryChange,
  onSearchSubmit,
  savedCount,
  showSavedOnly,
  onToggleSaved,
  onOpenAuth,
}) {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Logo />
        <SearchBar
          query={query}
          onQueryChange={onQueryChange}
          onSubmit={onSearchSubmit}
        />
        <HeaderActions
          savedCount={savedCount}
          showSavedOnly={showSavedOnly}
          onToggleSaved={onToggleSaved}
          onOpenAuth={onOpenAuth}
        />
      </div>
    </header>
  )
}
