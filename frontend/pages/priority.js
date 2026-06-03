import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import NotificationCard from '../components/NotificationCard';

const TYPE_WEIGHT = {
  placement: 3,
  result: 2,
  event: 1,
};

const score = (notification) => {
  const typeWeight = TYPE_WEIGHT[notification.Type.toLowerCase()] || 1;
  return typeWeight * 10000000000 + new Date(notification.Timestamp).getTime();
};

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

export default function PriorityPage() {
  const [notifications, setNotifications] = useState([]);
  const [viewedIds, setViewedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setViewedIds(getViewedIds());

    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications?limit=100&page=1');
        if (!response.ok) {
          throw new Error(`API error ${response.status}`);
        }
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        setError('Unable to load priority notifications.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const topNotifications = useMemo(() => {
    return [...notifications]
      .sort((a, b) => score(b) - score(a))
      .slice(0, 10);
  }, [notifications]);

  const markAsViewed = (id) => {
    const next = Array.from(new Set([...viewedIds, id]));
    setViewedIds(next);
    saveViewedIds(next);
  };

  return (
    <div className="page-shell">
      <header className="page-header">
        <div>
          <h1>Priority Inbox</h1>
          <p className="summary">The top 10 unread notifications ordered by type importance and recency.</p>
        </div>
        <div className="nav-actions">
          <Link href="/"><a className="button secondary">All Notifications</a></Link>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Top 10 Notifications</h2>
            <p>Placement is prioritized over results, then events, with newer items first inside each group.</p>
          </div>
        </div>

        {loading && <p className="status-message">Loading priority notifications...</p>}
        {error && <p className="status-message error">{error}</p>}

        <div className="grid-list">
          {topNotifications.map((notification, index) => (
            <NotificationCard
              key={notification.ID}
              notification={notification}
              isNew={!viewedIds.includes(notification.ID)}
              onMarkViewed={() => markAsViewed(notification.ID)}
              title={`#${index + 1} ${notification.Message}`}
              subtitle={`Type: ${notification.Type} · ${new Date(notification.Timestamp).toLocaleString()}`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
