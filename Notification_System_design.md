# STAGE1

## Priority Notification System Design

### Problem statement
The campus notification stream is too noisy, so important notifications are being missed. The goal is to create a priority inbox that always displays the top 10 most important unread notifications first.

### Requirements
- No database storage required.
- Notifications can be hardcoded or created locally.
- Priority is based on a combination of notification type and recency.
- A logging middleware should label and trace key processing steps.

### Sample API
The provided notification API is:

`GET http://4.224.186.213/evaluation-service/notification`

Sample response:
```json
{
  "notifications": [
    {
      "ID": "d146095a-0d86-aa34-9e69-3g00a14576bc",
      "Type": "Result",
      "Message": "mid-sem",
      "Timestamp": "2026-04-22 17:51:30"
    },
    {
      "ID": "b283218f-ea5a-4b7c-93a9-1f2f240d64b0",
      "Type": "Placement",
      "Message": "CSX Corporation hiring",
      "Timestamp": "2026-04-22 17:51:30"
    },
    {
      "ID": "81589ada-0ad3-4f77-9554-f52fb558e09d",
      "Type": "Event",
      "Message": "farewell",
      "Timestamp": "2026-04-22 17:51:30"
    }
  ]
}
```

### Priority rules
1. Placement notifications are highest priority.
2. Result notifications are second.
3. Event notifications are lowest.
4. Within the same type, newer notifications are ranked higher.

### Implementation approach
- A Python script `priority_notifications.py` implements Stage 1.
- The script uses hardcoded notification data and will fall back to it if the API is unavailable.
- It computes priority by combining type weight and timestamp sorting.
- No database is used.

### Logging middleware
A decorator named `logging_middleware` wraps key functions and logs entry/exit events for:
- loading hardcoded notifications
- fetching from the API
- parsing timestamps
- scoring/prioritizing notifications
- printing the top 10 results

### Output
The script prints the top 10 prioritized notifications with:
- type
- message
- ID
- timestamp

### Notes
- This design is compliant with Stage 1 requirements: hardcoded notifications, no frontend required, no database required.
- The file `Notification_System_design.md` is stored in the repo alongside the Stage 1 implementation.
