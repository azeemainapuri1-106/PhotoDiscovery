import { useCallback, useState } from 'react'
import { GOOGLE_CLIENT_ID } from '../../config/env'
import { useAuth } from '../../contexts/AuthContext'
import { AUTH_MODES } from '../../constants'
import { LogoMark } from '../common/Logo'
import GoogleLoginButton from './GoogleLoginButton'
import './AuthDialog.css'

export default function AuthDialog({ mode, onClose, onChangeMode }) {
  const { login, register, googleLogin } = useAuth()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const handleGoogleCredential = useCallback(async (idToken) => {
    setBusy(true)
    setError('')
    try {
      await googleLogin(idToken)
      onClose()
    } catch (requestError) {
      if (import.meta.env.DEV) {
        console.error('Google authentication backend error:', {
          status: requestError.status,
          response: requestError.data,
        })
      }
      setError(requestError.message || 'Google authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }, [googleLogin, onClose])

  if (!mode) return null

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const form = new FormData(event.currentTarget)
    const values = Object.fromEntries(form.entries())

    try {
      if (mode === 'signup') {
        await register({
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
        })
      } else {
        await login({
          email: values.email.trim(),
          password: values.password,
        })
      }
      onClose()
    } catch (requestError) {
      setError(requestError.message || 'Authentication failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <button className="auth-dialog__close" type="button" aria-label="Close dialog" onClick={onClose}>
          ×
        </button>
        <LogoMark className="auth-dialog__mark" />
        <p className="auth-dialog__eyebrow">A place for what moves you</p>
        <h2 id="auth-dialog-title">{AUTH_MODES[mode]}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <label>
              Name
              <input name="name" type="text" autoComplete="name" maxLength="100" required />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" autoComplete="email" maxLength="254" required />
          </label>
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              minLength="8"
              maxLength="128"
              required
            />
          </label>
          {error && <p className="auth-form__error" role="alert">{error}</p>}
          <button className="auth-form__submit" type="submit" disabled={busy}>
            {busy ? 'Please wait…' : mode === 'signup' ? 'Create account' : 'Log in'}
          </button>
        </form>

        <div className="auth-dialog__separator"><span>or continue with</span></div>
        {GOOGLE_CLIENT_ID
          ? <GoogleLoginButton
              onCredential={handleGoogleCredential}
              onError={setError}
              disabled={busy}
            />
          : <p className="auth-dialog__google-note">
              Google sign-in is disabled. Set VITE_GOOGLE_CLIENT_ID in the frontend .env file and restart Vite.
            </p>}

        <p className="auth-dialog__switch">
          {mode === 'signup' ? 'Already have an account?' : 'New to PhotoDiscovery?'}{' '}
          <button type="button" onClick={() => { setError(''); onChangeMode(mode === 'signup' ? 'login' : 'signup') }}>
            {mode === 'signup' ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </section>
    </div>
  )
}
