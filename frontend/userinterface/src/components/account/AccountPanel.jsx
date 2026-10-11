import { useEffect, useState } from 'react'
import { accountService } from '../../services'
import './AccountPanel.css'

function useCountdown(lockedUntil) {
  const [now, setNow] = useState(Date.now())

  useEffect(() => {
    if (!lockedUntil) return undefined
    const timer = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(timer)
  }, [lockedUntil])

  if (!lockedUntil) return null
  const remaining = Math.max(0, new Date(lockedUntil).getTime() - now)
  const hours = Math.floor(remaining / 3_600_000)
  const minutes = Math.floor((remaining % 3_600_000) / 60_000)
  const seconds = Math.floor((remaining % 60_000) / 1000)
  return `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`
}

export default function AccountPanel({ user, page, onBack }) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    setStatus('loading')
    const request = page === 'history'
      ? accountService.getHistory({ signal: controller.signal })
      : accountService.getQuota({ signal: controller.signal })

    request
      .then((response) => {
        setData(response)
        setStatus('success')
        setError(null)
      })
      .catch((requestError) => {
        if (requestError.name === 'AbortError') return
        setError(requestError)
        setStatus('error')
      })

    return () => controller.abort()
  }, [page, user.id])

  const countdown = useCountdown(page === 'profile' ? data?.lockedUntil : null)

  return (
    <main className="account-panel">
      <button className="account-panel__back" type="button" onClick={onBack}>← Back to discovery</button>
      <p className="account-panel__eyebrow">{page === 'history' ? 'Your activity' : 'Your account'}</p>
      <h1>{page === 'history' ? 'Download history' : 'Profile'}</h1>

      {status === 'loading' && <p className="account-panel__message" role="status">Loading account details…</p>}
      {status === 'error' && (
        <p className="account-panel__error" role="alert">
          {error?.message || 'We could not load your account details.'}
        </p>
      )}

      {status === 'success' && page === 'profile' && (
        <section className="account-panel__card">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <div className="account-quota">
            <span>Downloads remaining</span>
            <strong>{data.downloadsLeft} of 3</strong>
          </div>
          {countdown && countdown !== '0h 00m 00s' && (
            <p className="account-panel__lock" role="status">Next download in {countdown}</p>
          )}
        </section>
      )}

      {status === 'success' && page === 'history' && (
        data.length
          ? <ul className="download-history">
              {data.map((entry) => (
                <li key={entry.id}>
                  <img src={entry.image} alt="" loading="lazy" />
                  <div>
                    <strong>{entry.title}</strong>
                    <span>by {entry.photographer}</span>
                    <time dateTime={entry.downloadedAt}>{new Date(entry.downloadedAt).toLocaleString()}</time>
                  </div>
                </li>
              ))}
            </ul>
          : <p className="account-panel__message">You have not downloaded any photos yet.</p>
      )}
    </main>
  )
}
