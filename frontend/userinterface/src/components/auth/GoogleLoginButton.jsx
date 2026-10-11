import { useEffect, useRef } from 'react'
import { GOOGLE_CLIENT_ID } from '../../config/env'

export default function GoogleLoginButton({ onCredential, onError, disabled }) {
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !buttonRef.current) return undefined

    let active = true
    const renderGoogleButton = () => {
      const identity = window.google?.accounts?.id
      if (!active || !identity || !buttonRef.current) return

      identity.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (credentialResponse) => {
          if (credentialResponse?.credential) {
            onCredential(credentialResponse.credential)
          } else {
            onError('Google did not return an ID token. Please try again.')
          }
        },
      })
      buttonRef.current.replaceChildren()
      identity.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 300,
      })
    }

    const script = document.getElementById('google-identity-script')
    if (!script) {
      onError('Google sign-in script is missing. Reload the page and try again.')
      return undefined
    }
    const handleScriptError = () => {
      if (active) onError('Google sign-in could not be loaded. Please use email and password.')
    }

    script.addEventListener('load', renderGoogleButton)
    script.addEventListener('error', handleScriptError, { once: true })
    renderGoogleButton()

    return () => {
      active = false
      script.removeEventListener('load', renderGoogleButton)
      script.removeEventListener('error', handleScriptError)
    }
  }, [onCredential, onError])

  return (
    <div
      className={`auth-dialog__google${disabled ? ' is-disabled' : ''}`}
      ref={buttonRef}
      aria-disabled={disabled}
    />
  )
}
