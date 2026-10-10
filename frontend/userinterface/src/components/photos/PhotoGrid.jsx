import PhotoCard from './PhotoCard'
import './PhotoGrid.css'

// Masonry-style grid of PhotoCards.
export default function PhotoGrid({ photos, favouriteIds, onToggleFavourite }) {
  return (
    <div className="photo-grid" aria-live="polite">
      {photos.map((photo) => (
        <PhotoCard
          key={photo.id}
          photo={photo}
          isFavourite={favouriteIds.includes(photo.id)}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </div>
  )
}
