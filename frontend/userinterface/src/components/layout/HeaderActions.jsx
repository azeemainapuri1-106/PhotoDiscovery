import Button from '../common/Button'
import { UserIcon } from '../common/Icons'
import './HeaderActions.css'

export default function HeaderActions({
  savedCount,
  showSavedOnly,
  onToggleSaved,
  onOpenAuth,
  user,
  onOpenProfile,
  onOpenHistory,
  onLogout,
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
      {user
        ? <>
            <button
              className="header-link header-link--profile"
              type="button"
              aria-label={`Open profile for ${user.name}`}
              title={user.name}
              onClick={onOpenProfile}
            >
              <UserIcon />
            </button>
            <button className="header-link header-link--history" type="button" onClick={onOpenHistory}>Downloads</button>
            <button className="header-link" type="button" onClick={onLogout}>Log out</button>
          </>
        : <>
            <button className="header-link" type="button" onClick={() => onOpenAuth('login')}>Log in</button>
            <Button className="header-signup" onClick={() => onOpenAuth('signup')}>Sign up</Button>
          </>}
    </nav>
  )
}
