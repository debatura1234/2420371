# Campus Notification Project

## Stage 1
- `priority_notifications.py` selects the top 10 notifications by type importance and recency.
- `Notification_System_design.md` documents the priority strategy and Stage 2 plan.
- `stage1_output.png` shows the priority inbox output.

## Stage 2
- `frontend/` contains a Next.js application with:
  - `/` for all notifications
  - `/priority` for the top 10 priority inbox
  - `/pages/api/notifications.js` proxying the external notification API
  - local storage read/unread tracking

## Run the frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open `http://localhost:3000`

## Notes
- The app is verified to install and build successfully under the current environment.
- If Node.js requires OpenSSL legacy mode, the frontend scripts already set `NODE_OPTIONS=--openssl-legacy-provider`.
