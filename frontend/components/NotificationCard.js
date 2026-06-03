export default function NotificationCard({ notification, isNew, onMarkViewed, title, subtitle }) {
  return (
    <article className={`card ${isNew ? 'card-new' : ''}`}>
      <div className="card-header">
        <div>
          <h3>{title || notification.Message}</h3>
          <p className="meta">{subtitle || `${notification.Type} · ${notification.Timestamp}`}</p>
        </div>
        {isNew && <span className="chip">New</span>}
      </div>
      <p className="message">{notification.Message}</p>
      <p className="meta small">ID: {notification.ID}</p>
      <button type="button" className="button small" onClick={onMarkViewed}>
        Mark as viewed
      </button>
    </article>
  );
}
