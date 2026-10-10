import Button from '../common/Button'
import './EmptyState.css'

// Generic centred message. Used for: no results, nothing saved, loading, error.
// The button only shows when both `actionLabel` and `onAction` are given.
export default function EmptyState({
  mark = '⌕',
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state" role="status">
      <span className="empty-state__mark">{mark}</span>
      <h2>{title}</h2>
      <p>{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
