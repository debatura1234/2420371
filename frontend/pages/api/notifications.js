import http from 'http';

const API_HOST = '4.224.186.213';
const API_PATH = '/evaluation-service/notification';

const fallbackNotifications = [
  {
    ID: 'd146095a-0d86-aa34-9e69-3g00a14576bc',
    Type: 'Result',
    Message: 'mid-sem result available',
    Timestamp: '2026-05-05 16:22:00',
  },
  {
    ID: 'b283218f-ea5a-4b7c-93a9-1f2f240d64b0',
    Type: 'Placement',
    Message: 'CSX Corporation hiring',
    Timestamp: '2026-05-06 09:10:15',
  },
  {
    ID: '81589ada-0ad3-4f77-9554-f52fb558e09d',
    Type: 'Event',
    Message: 'farewell ceremony announced',
    Timestamp: '2026-05-04 14:00:00',
  },
  {
    ID: 'f16c7b73-48d7-4998-8e62-ff3fbe53a6db',
    Type: 'Placement',
    Message: 'Campus drive: Nimbus Labs',
    Timestamp: '2026-05-06 12:35:22',
  },
  {
    ID: 'e5a9342c-7d98-4010-b911-0b7a10b6c428',
    Type: 'Result',
    Message: 'project grades published',
    Timestamp: '2026-05-05 17:45:00',
  },
  {
    ID: '95dc8a25-7dcd-4ef7-8298-c99f4f704f7f',
    Type: 'Event',
    Message: 'guest lecture on AI',
    Timestamp: '2026-05-06 11:00:00',
  },
  {
    ID: '31b4ccae-4dde-4d6e-a1dc-019db88926b1',
    Type: 'Placement',
    Message: 'Internship drive: TekNova',
    Timestamp: '2026-05-06 09:00:00',
  },
  {
    ID: 'd1fb0d61-9984-4fef-b279-0f3d4b9dc04d',
    Type: 'Result',
    Message: 'final semester marks released',
    Timestamp: '2026-05-06 08:30:00',
  },
  {
    ID: '4b9f6b1e-30c4-4c5d-b2ee-2b05c720b5b0',
    Type: 'Event',
    Message: 'club fair tomorrow',
    Timestamp: '2026-05-05 09:00:00',
  },
  {
    ID: '7a1c864d-01a2-4341-8133-fdb7f0739d7d',
    Type: 'Placement',
    Message: 'Leadership summit application open',
    Timestamp: '2026-05-05 18:20:30',
  },
  {
    ID: '2fe6b432-4d02-4ff6-8c14-451ea2a07a4e',
    Type: 'Result',
    Message: 'extra credit assignment outcome',
    Timestamp: '2026-05-04 10:15:00',
  },
  {
    ID: 'a5c95d12-4f15-4b21-a950-1c2ee5d9523d',
    Type: 'Event',
    Message: 'sports meet schedule',
    Timestamp: '2026-05-06 07:45:00',
  },
  {
    ID: 'bc9e5d85-5c6f-4e2f-b808-7d3f22f30d96',
    Type: 'Placement',
    Message: 'FastTrack apprenticeship opening',
    Timestamp: '2026-05-06 13:05:40',
  },
  {
    ID: 'edf73722-e4fd-4b82-a9de-d8493324b5aa',
    Type: 'Result',
    Message: 'lab practical results available',
    Timestamp: '2026-05-06 08:10:10',
  },
  {
    ID: '8c6f8a69-4d89-4f53-9d73-0bd523b1fc0a',
    Type: 'Event',
    Message: 'movie night invitation',
    Timestamp: '2026-05-05 20:00:00',
  },
];

const fetchNotifications = (query) =>
  new Promise((resolve, reject) => {
    const path = new URL(`http://${API_HOST}${API_PATH}`);
    if (query.limit) path.searchParams.set('limit', query.limit);
    if (query.page) path.searchParams.set('page', query.page);
    if (query.notification_type) path.searchParams.set('notification_type', query.notification_type);

    http
      .get(path.toString(), (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });
        res.on('end', () => {
          try {
            const payload = JSON.parse(body);
            if (payload && Array.isArray(payload.notifications)) {
              resolve(payload.notifications);
            } else {
              reject(new Error('Unexpected API response format'));
            }
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', reject)
      .setTimeout(6000, function () {
        this.abort();
      });
  });

const filterNotifications = (items, notificationType) => {
  let filtered = [...items];
  if (notificationType) {
    filtered = filtered.filter(
      (item) => item.Type.toLowerCase() === notificationType.toLowerCase(),
    );
  }
  filtered.sort((a, b) => new Date(b.Timestamp) - new Date(a.Timestamp));
  return filtered;
};

export default async (req, res) => {
  const { limit = '50', page = '1', notification_type } = req.query;

  try {
    const notifications = await fetchNotifications(req.query);
    const filtered = filterNotifications(notifications, notification_type);
    const result = filtered.slice((parseInt(page, 10) - 1) * parseInt(limit, 10), parseInt(page, 10) * parseInt(limit, 10));
    res.status(200).json({ notifications: result });
  } catch (error) {
    const filtered = filterNotifications(fallbackNotifications, notification_type);
    const result = filtered.slice((parseInt(page, 10) - 1) * parseInt(limit, 10), parseInt(page, 10) * parseInt(limit, 10));
    res.status(200).json({ notifications: result, fallback: true });
  }
};
