import Button from '../common/Button'
import { LogoMark } from '../common/Logo'
import { AUTH_MODES } from '../../constants'
import './AuthDialog.css'

// Modal for Log in / Sign up. Currently a "coming soon" message.
//
// TO GO LIVE: replace the paragraph + button below with a form that calls
// authService.login() / authService.register() (see src/services/authService.js).
// `mode` is 'login' | 'signup'; render nothing when it is null.
export default function AuthDialog({ mode, onClose }) {
  if (!mode) return null

  return (
    <div
      className="dialog-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        // close only when the dark backdrop itself is clicked, not the dialog
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="auth-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-dialog-title"
      >
        <button
          className="auth-dialog__close"
          type="button"
          aria-label="Close dialog"
          onClick={onClose}
        >
          ×
        </button>
        <LogoMark className="auth-dialog__mark" />
        <p className="auth-dialog__eyebrow">A place for what moves you</p>
        <h2 id="auth-dialog-title">{AUTH_MODES[mode]}</h2>
        <p className="auth-dialog__copy">
          Sign in is coming soon. For now, keep exploring and save a few things
          that catch your eye.
        </p>
        <Button className="auth-dialog__button" onClick={onClose}>
          Keep exploring
        </Button>
      </section>
    </div>
  )
}
