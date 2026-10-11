import { useEffect, useState } from 'react'
import { photoService } from '../../services'
import './PhotoDetailDialog.css'

export default function PhotoDetailDialog({ photoId, onClose }) {
  const [photo, setPhoto] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!photoId) return undefined
    const controller = new AbortController()
    photoService.getPhoto(photoId, { signal: controller.signal })
      .then(setPhoto)
      .catch((requestError) => {
        if (requestError.name !== 'AbortError') setError(requestError)
      })
    return () => controller.abort()
  }, [photoId])

  if (!photoId) return null

  return (
    <div className="photo-detail-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="photo-detail" role="dialog" aria-modal="true" aria-label="Photo details">
        <button type="button" className="photo-detail__close" onClick={onClose} aria-label="Close photo details">×</button>
        {error
          ? <p className="photo-detail__error" role="alert">{error.message}</p>
          : photo
            ? <>
                <img src={photo.image} alt={photo.title} />
                <div className="photo-detail__metadata">
                  <h2>{photo.title}</h2>
                  <p>Photographed by {photo.photographer}</p>
                  <p>{photo.category} · {photo.width} × {photo.height}</p>
                  {photo.photographerUrl && (
                    <a href={photo.photographerUrl} target="_blank" rel="noreferrer">Photographer profile</a>
                  )}
                </div>
              </>
            : <p className="photo-detail__loading" role="status">Loading photo details…</p>}
      </section>
    </div>
  )
}
