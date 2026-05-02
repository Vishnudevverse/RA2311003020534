import { formatTimestamp } from '../utils/notificationUtils'

const TYPE_STYLES = {
  Placement: 'danger',
  Result: 'info',
  Event: 'primary',
}

const NotificationCard = ({ notification, onMarkRead }) => {
  const badgeStyle = TYPE_STYLES[notification.type] || 'secondary'
  const cardClassName = [
    'card',
    'shadow-sm',
    'notification-card',
    notification.isRead
      ? 'opacity-75 viewed'
      : 'border-start border-4 border-primary',
  ].join(' ')

  return (
    <article className={cardClassName}>
      <div className="card-header d-flex align-items-center justify-content-between">
        <span className={`badge bg-${badgeStyle}`}>{notification.type}</span>
        <span className="text-muted small">
          {notification.isRead ? 'Viewed' : 'New'}
        </span>
      </div>
      <div className="card-body">
        <p className="mb-0">{notification.message}</p>
      </div>
      <div className="card-footer d-flex flex-wrap align-items-center justify-content-between gap-2">
        <span className="text-muted small">
          {formatTimestamp(notification.timestamp)}
        </span>
        <button
          type="button"
          className="btn btn-sm btn-outline-primary"
          onClick={() => onMarkRead(notification.id)}
          disabled={notification.isRead}
        >
          Mark as Read
        </button>
      </div>
    </article>
  )
}

export default NotificationCard
