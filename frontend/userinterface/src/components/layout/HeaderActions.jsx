import Button from '../common/Button'
import './HeaderActions.css'

// Right side of the header: Saved toggle, Log in, Sign up.
// `onOpenAuth` receives 'login' or 'signup'.
export default function HeaderActions({
  savedCount,
  showSavedOnly,
  onToggleSaved,
  onOpenAuth,
}) {
  return (
    <nav className="header-actions" aria-label="Account navigation">
      <button
        className={`header-link header-link--saved ${showSavedOnly ? 'is-active' : ''}`}
        type="button"
        aria-pressed={showSavedOnly}
        onClick={onToggleSaved}
      >
        Saved
        {savedCount > 0 && <span className="saved-count">{savedCount}</span>}
      </button>
      <span className="header-actions__divider" aria-hidden="true" />
      <button
        className="header-link"
        type="button"
        onClick={() => onOpenAuth('login')}
      >
        Log in
      </button>
      <Button className="header-signup" onClick={() => onOpenAuth('signup')}>
        Sign up
      </Button>
    </nav>
  )
}
