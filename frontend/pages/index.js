import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import NotificationCard from '../components/NotificationCard';

const formatDate = (timestamp) => new Date(timestamp).toLocaleString();

const getViewedIds = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(window.localStorage.getItem('viewedNotifications') || '[]');
  } catch {
    return [];
  }
};

const saveViewedIds = (ids) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem('viewedNotifications', JSON.stringify(ids));
};

const sortNotifications = (items) =>
  [...items].sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));

export default function Home() {
  const [notifications, setNotifications] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    setViewedIds(getViewedIds());

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=50&page=1');
        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }
        const data = await response.json();
        setNotifications(sortNotifications(data.notifications || []));
      } catch (err) {
        setError('Unable to load notifications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const visibleNotifications = useMemo(() => {
    if (filterType === 'all') return notifications;
    return notifications.filter((item) => item.Type.toLowerCase() === filterType);
  }, [notifications, filterType]);

  const markAsViewed = (id) => {
    const next = Array.from(new Set([...viewedIds, id]));
    setViewedIds(next);
    saveViewedIds(next);
  };

  const unreadCount = notifications.filter((item) => !viewedIds.includes(item.ID)).length;

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1>Campus Notifications</h1>
          <p className="summary">All notifications and unread indicators for the student inbox.</p>
        </div>
        <div className="nav-actions">
          <Link href="/priority"><a className="button secondary">Priority Inbox</a></Link>
          <span className="badge">Unread: {unreadCount}</span>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>All Notifications</h2>
            <p>Sorted newest first with read/unread state stored locally in your browser.</p>
          </div>
          <div className="filter-group">
            {['all', 'placement', 'result', 'event'].map((type) => (
              <button
                key={type}
                type="button"
                className={filterType === type ? 'button active' : 'button ghost'}
                onClick={() => setFilterType(type)}
              >
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading && <p className="status-message">Loading notifications...</p>}
        {error && <p className="status-message error">{error}</p>}
        {!loading && !error && visibleNotifications.length === 0 && (
          <p className="status-message">No notifications available.</p>
        )}

        <div className="grid-list">
          {visibleNotifications.map((notification) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              isNew={!viewedIds.includes(notification.ID)}
              onMarkViewed={() => markAsViewed(notification.ID)}
              subtitle={formatDate(notification.Timestamp)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
