import { useEffect, useState } from 'react'
import { DownloadIcon, HeartIcon } from '../common/Icons'
import './PhotoCard.css'

// One photo tile: image (with loading skeleton), credit line, heart and download.
// `loaded` is purely visual (fade-in), so it stays local to this component.
export default function PhotoCard({ photo, isFavourite, onToggleFavourite, onDownload, onOpenDetails }) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [downloadBusy, setDownloadBusy] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [lockedUntil, setLockedUntil] = useState(null)
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!lockedUntil) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [lockedUntil])

  async function handleDownload() {
    setDownloadBusy(true)
    setDownloadError('')
    setDownloadUrl('')
    setLockedUntil(null)
    try {
      await onDownload(photo.id)
      setDownloadUrl('started')
    } catch (error) {
      setDownloadError(error.message || 'Download failed. Please try again.')
      if (error.status === 429 && error.data?.locked_until) {
        setLockedUntil(error.data.locked_until)
      }
    } finally {
      setDownloadBusy(false)
    }
  }

  const remaining = lockedUntil
    ? Math.max(0, new Date(lockedUntil).getTime() - now)
    : 0
  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)

  return (
    <article
      className={`photo-card${loaded ? ' is-loaded' : ''}${failed ? ' has-error' : ''}`}
    >
      <button
        className={`photo-card__image photo-card__image--${photo.ratio}`}
        type="button"
        aria-label={`View details for ${photo.title} by ${photo.photographer}`}
        onClick={() => onOpenDetails(photo.id)}
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
      </button>
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
          <button
            className="download-button"
            type="button"
            aria-label={`Download ${photo.title}`}
            disabled={downloadBusy}
            onClick={handleDownload}
          >
            <DownloadIcon />
            <span>{downloadBusy ? 'Working…' : 'Download'}</span>
          </button>
        </div>
      </div>
      {(downloadError || downloadUrl) && (
        <div className="photo-card__download-status" role={downloadError ? 'alert' : 'status'}>
          {downloadError && <span>{downloadError}</span>}
          {lockedUntil && remaining > 0 && (
            <span>Next download in {hours}h {String(minutes).padStart(2, '0')}m</span>
          )}
          {downloadUrl && <span>Your download has started.</span>}
        </div>
      )}
    </article>
  )
}
