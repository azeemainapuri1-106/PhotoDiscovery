import { useState } from 'react'
import { DownloadIcon, HeartIcon } from '../common/Icons'
import './PhotoCard.css'

// One photo tile: image (with loading skeleton), credit line, heart and download.
// `loaded` is purely visual (fade-in), so it stays local to this component.
export default function PhotoCard({ photo, isFavourite, onToggleFavourite }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <article
      className={`photo-card${loaded ? ' is-loaded' : ''}${failed ? ' has-error' : ''}`}
    >
      <a
        className={`photo-card__image photo-card__image--${photo.ratio}`}
        href={photo.image}
        target="_blank"
        rel="noreferrer"
        aria-label={`View ${photo.title} by ${photo.photographer}`}
      >
        <img
          src={photo.image}
          alt={photo.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
        {!loaded && !failed && (
          <span className="photo-card__skeleton" aria-hidden="true" />
        )}
        {failed && (
          <span className="photo-card__error" role="img" aria-label={`${photo.title} image unavailable`}>
            Image unavailable
          </span>
        )}
      </a>
      <div className="photo-card__overlay">
        <div className="photo-card__credit">
          <span>{photo.photographer}</span>
          <span className="photo-card__view-profile">{photo.category}</span>
        </div>
        <div className="photo-card__actions">
          <button
            className={`icon-button favourite-button ${isFavourite ? 'is-active' : ''}`}
            type="button"
            aria-label={
              isFavourite
                ? `Remove ${photo.title} from favourites`
                : `Add ${photo.title} to favourites`
            }
            aria-pressed={isFavourite}
            onClick={() => onToggleFavourite(photo.id)}
          >
            <HeartIcon filled={isFavourite} />
          </button>
          <a
            className="download-button"
            href={photo.image}
            download={`${photo.title.toLowerCase().replaceAll(' ', '-')}.jpg`}
            aria-label={`Download ${photo.title}`}
          >
            <DownloadIcon />
            <span>Download</span>
          </a>
        </div>
      </div>
    </article>
  )
}
