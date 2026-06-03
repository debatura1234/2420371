# Campus Notifications Frontend

## Overview
This is a Next.js application that displays:
- all notifications on the home page
- priority notifications on `/priority`
- read/unread state using browser local storage
- API proxy through `/api/notifications`

## Run locally
1. Open a terminal in `frontend`
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000`

## Notes
- The app fetches notifications from the provided external API and falls back to local data if the API is unavailable.
- `page`, `limit`, and `notification_type` query parameters are supported by the internal proxy route.
