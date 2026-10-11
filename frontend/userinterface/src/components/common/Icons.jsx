// Small reusable SVG icons. Styling for them lives in the component that uses them
// (e.g. .heart-icon in PhotoCard.css, search icon in SearchBar.css).

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.8" />
      <path d="m16 16 4.2 4.2" />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  )
}

export function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={filled ? 'heart-icon is-filled' : 'heart-icon'}
    >
      <path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />
    </svg>
  )
}

export function DownloadIcon() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M10 2.8v9.1m0 0 3.3-3.3M10 11.9 6.7 8.6M3.8 13.5v2.8h12.4v-2.8" />
    </svg>
  )
}
