import './Logo.css'

// Just the triangle mark. `className` lets other components size/colour it
// (the auth dialog passes "auth-dialog__mark").
export function LogoMark({ className = '' }) {
  return (
    <span className={`wordmark__symbol ${className}`.trim()} aria-hidden="true">
      <svg viewBox="0 0 30 30">
        <path d="M15 3.5 26.5 25H3.5L15 3.5Z" />
        <path d="M15 11.5 22.2 25H7.8L15 11.5Z" />
      </svg>
    </span>
  )
}

// Mark + the word "aura", linking home.
// variant: 'default' (header) | 'footer' (smaller)
export default function Logo({ variant = 'default' }) {
  const className = variant === 'footer' ? 'wordmark wordmark--footer' : 'wordmark'

  return (
    <a className={className} href="/" aria-label="Aura home">
      <LogoMark />
      <span>aura</span>
    </a>
  )
}
