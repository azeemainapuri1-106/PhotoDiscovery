import CategoryBar from '../photos/CategoryBar'
import PhotoGrid from '../photos/PhotoGrid'
import EmptyState from '../photos/EmptyState'
import './Discovery.css'

// The photo browsing section: category bar + (grid | loading | error | empty).
// It decides WHAT to show; App decides WHAT DATA to give it.
export default function Discovery({
  categories,
  activeCategory,
  onCategoryChange,
  photos,
  status, // 'loading' | 'success' | 'error'
  error,
  onRetry,
  favouriteIds,
  onToggleFavourite,
  onDownload,
  onOpenDetails,
  showSavedOnly,
  onClearFilters,
}) {
  const nothingSavedYet = showSavedOnly && favouriteIds.length === 0

  function renderContent() {
    // First load only: if we already have photos we keep showing them
    // while a new search loads, so the page doesn't flash.
    if (status === 'loading' && photos.length === 0) {
      return <div className="photo-grid-skeleton" role="status" aria-label="Loading photographs">
        {Array.from({ length: 12 }, (_, index) => <span key={index} />)}
      </div>
    }

    if (status === 'error') {
      return (
        <EmptyState
          mark="!"
          title="Something went wrong"
          message={error?.message || 'We could not load the photographs.'}
          actionLabel="Try again"
          onAction={onRetry}
        />
      )
    }

    if (photos.length === 0) {
      return (
        <EmptyState
          title={nothingSavedYet ? 'Nothing saved just yet' : 'No photographs found'}
          message={
            nothingSavedYet
              ? 'Tap the heart on a photograph and it will be waiting here.'
              : 'Try another search or explore a different collection.'
          }
          actionLabel="Clear filters"
          onAction={onClearFilters}
        />
      )
    }

    return (
      <PhotoGrid
        photos={photos}
        favouriteIds={favouriteIds}
        onToggleFavourite={onToggleFavourite}
        onDownload={onDownload}
        onOpenDetails={onOpenDetails}
      />
    )
  }

  return (
    <section className="discovery" aria-label="Discover photos">
      <CategoryBar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={onCategoryChange}
        photoCount={photos.length}
      />
      {renderContent()}
    </section>
  )
}
