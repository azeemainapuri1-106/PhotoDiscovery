import { useMemo, useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Intro from './components/home/Intro'
import Discovery from './components/home/Discovery'
import AuthDialog from './components/auth/AuthDialog'
import { DEFAULT_CATEGORY } from './constants'
import {
  useCategories,
  useFavourites,
  usePhotos,
  useSearchQuery,
} from './hooks'
import './App.css'

// App is the "container": it owns the page state, calls the hooks (which talk
// to the services/API), and passes data + handlers down to the components.
// Components below it only display things.
function App() {
  // ----- state -----
  const { query, setQuery, commitSearch, clearSearch } = useSearchQuery()
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [authMode, setAuthMode] = useState(null) // null | 'login' | 'signup'

  // ----- data (mock now, API later - same code either way) -----
  const categories = useCategories()
  const { favouriteIds, toggleFavourite } = useFavourites()
  const { photos, status, error, refetch } = usePhotos({
    query,
    category: activeCategory,
  })

  // "Saved" is a view over the loaded photos
  const visiblePhotos = useMemo(
    () =>
      showSavedOnly
        ? photos.filter((photo) => favouriteIds.includes(photo.id))
        : photos,
    [photos, showSavedOnly, favouriteIds],
  )

  // ----- handlers -----
  function handleSearchSubmit() {
    commitSearch()
    setActiveCategory(DEFAULT_CATEGORY)
    setShowSavedOnly(false)
  }

  function handleToggleSaved() {
    setActiveCategory(DEFAULT_CATEGORY)
    setShowSavedOnly((current) => !current)
  }

  function handleCategoryChange(category) {
    setActiveCategory(category)
    setShowSavedOnly(false)
  }

  function handleClearFilters() {
    clearSearch()
    setActiveCategory(DEFAULT_CATEGORY)
    setShowSavedOnly(false)
  }

  return (
    <div className="app-shell">
      <Header
        query={query}
        onQueryChange={setQuery}
        onSearchSubmit={handleSearchSubmit}
        savedCount={favouriteIds.length}
        showSavedOnly={showSavedOnly}
        onToggleSaved={handleToggleSaved}
        onOpenAuth={setAuthMode}
      />

      <main>
        <Intro />
        <Discovery
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          photos={visiblePhotos}
          status={status}
          error={error}
          onRetry={refetch}
          favouriteIds={favouriteIds}
          onToggleFavourite={toggleFavourite}
          showSavedOnly={showSavedOnly}
          onClearFilters={handleClearFilters}
        />
      </main>

      <Footer />

      <AuthDialog mode={authMode} onClose={() => setAuthMode(null)} />
    </div>
  )
}

export default App
