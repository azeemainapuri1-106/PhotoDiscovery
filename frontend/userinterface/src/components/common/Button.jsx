import './Button.css'

// Generic button. `variant="dark"` gives the dark filled style.
// Any extra props (onClick, aria-*, ...) are passed straight to <button>.
export default function Button({
  variant = 'dark',
  className = '',
  type = 'button',
  children,
  ...rest
}) {
  const classes = ['button', `button--${variant}`, className]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={classes} type={type} {...rest}>
      {children}
    </button>
  )
}
