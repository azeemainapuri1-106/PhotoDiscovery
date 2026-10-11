import { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Intro from './components/home/Intro'
import Discovery from './components/home/Discovery'
import AuthDialog from './components/auth/AuthDialog'
import AccountPanel from './components/account/AccountPanel'
import PhotoDetailDialog from './components/photos/PhotoDetailDialog'
import { DEFAULT_CATEGORY } from './constants'
import { useAuth } from './contexts/AuthContext'
import {
  useCategories,
  useFavourites,
  usePhotos,
  useSearchQuery,
} from './hooks'
import { downloadService, photoService } from './services'
import './App.css'

function App() {
  const { user, authRequired, logout, dismissAuthRequired } = useAuth()
  const { query, setQuery, commitSearch, clearSearch } = useSearchQuery()
  const [activeCategory, setActiveCategory] = useState(DEFAULT_CATEGORY)
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [authMode, setAuthMode] = useState(null)
  const [accountPage, setAccountPage] = useState(null)
  const [detailPhotoId, setDetailPhotoId] = useState(null)
  const [savedPhotos, setSavedPhotos] = useState([])
  const [savedStatus, setSavedStatus] = useState('success')
  const [savedError, setSavedError] = useState(null)
  const [savedReload, setSavedReload] = useState(0)

  const categories = useCategories()
  const { favouriteIds, toggleFavourite, error: favouriteError } = useFavourites(user?.id)
  const { photos, status, error, refetch } = usePhotos({
    query,
    category: activeCategory,
  })

  useEffect(() => {
    if (authRequired) setAuthMode('login')
  }, [authRequired])

  useEffect(() => {
    if (!user) {
      setShowSavedOnly(false)
      setSavedPhotos([])
      return undefined
    }
    if (!showSavedOnly) return undefined
    const controller = new AbortController()
    setSavedStatus('loading')
    setSavedError(null)

    Promise.all(favouriteIds.map((id) => photoService.getPhoto(id, { signal: controller.signal })))
      .then((items) => {
        setSavedPhotos(items)
        setSavedStatus('success')
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setSavedError(requestError)
        setSavedStatus('error')
      })

    return () => controller.abort()
  }, [showSavedOnly, user, favouriteIds, savedReload])

  const visiblePhotos = useMemo(
    () => showSavedOnly ? savedPhotos : photos,
    [photos, savedPhotos, showSavedOnly],
  )
  const visibleStatus = showSavedOnly ? savedStatus : status
  const visibleError = showSavedOnly ? savedError : error

  function handleSearchSubmit() {
    commitSearch()
    setActiveCategory(DEFAULT_CATEGORY)
    setShowSavedOnly(false)
    setAccountPage(null)
  }

  function handleToggleSaved() {
    if (!user) {
      setAuthMode('login')
      return
    }
    setAccountPage(null)
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

  async function handleToggleFavourite(photoId) {
    if (!user) {
      setAuthMode('login')
      return
    }
    await toggleFavourite(photoId)
  }

  async function handleDownload(photoId) {
    if (!user) {
      setAuthMode('login')
      throw new Error('Log in to download this photograph.')
    }
    const photo = visiblePhotos.find((candidate) => candidate.id === String(photoId))
    if (!photo) throw new Error('This photograph is no longer available. Refresh and try again.')
    return downloadService.download(photo)
  }

  const closeAuth = useCallback(() => {
    setAuthMode(null)
    setAccountPage(null)
    setShowSavedOnly(false)
    dismissAuthRequired()
  }, [dismissAuthRequired])

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
        user={user}
        onOpenProfile={() => { setShowSavedOnly(false); setAccountPage('profile') }}
        onOpenHistory={() => { setShowSavedOnly(false); setAccountPage('history') }}
        onLogout={() => { logout(); setShowSavedOnly(false); setAccountPage(null) }}
      />

      {accountPage
        ? <AccountPanel user={user} page={accountPage} onBack={() => setAccountPage(null)} />
        : <>
            <main>
              {favouriteError && (
                <p className="app-error-notice" role="alert">{favouriteError.message}</p>
              )}
              <Intro />
              <Discovery
                categories={categories}
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
                photos={visiblePhotos}
                status={visibleStatus}
                error={visibleError}
                onRetry={showSavedOnly ? () => setSavedReload((count) => count + 1) : refetch}
                favouriteIds={favouriteIds}
                onToggleFavourite={handleToggleFavourite}
                onDownload={handleDownload}
                onOpenDetails={setDetailPhotoId}
                showSavedOnly={showSavedOnly}
                onClearFilters={handleClearFilters}
              />
            </main>
            <PhotoDetailDialog photoId={detailPhotoId} onClose={() => setDetailPhotoId(null)} />
          </>}

      <Footer />
      <AuthDialog
        mode={authMode}
        onClose={closeAuth}
        onChangeMode={setAuthMode}
      />
    </div>
  )
}

export default App
