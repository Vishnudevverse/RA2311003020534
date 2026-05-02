# Campus Notifications Platform - System Design

## Overview
The system is designed to surface time-sensitive campus updates while prioritizing the highest-impact notifications for students. The solution is split into three parts:

- Frontend: Vite + React application in `notification_app_fe/`.
- Logging middleware: Reusable log utility in `logging_middleware/`.
- Backend stub: Placeholder services in `notification_app_be/`.

## Data Flow
1. Frontend requests notifications using a mock service layer.
2. Service attaches a static Bearer token header to simulate authenticated requests.
3. Mock data is returned locally and stored in React state.
4. The Log middleware records system events (load, filter change, mark as read).
5. The UI renders the data in two modes: Dashboard and Priority Inbox.

## Priority Inbox Logic
The priority algorithm sorts unread notifications by:

1. **Type Weight**
   - Placement: weight 3
   - Result: weight 2
   - Event: weight 1
2. **Recency**
   - When weights are equal, the most recent `timestamp` wins.

`getTopNotifications(n)` filters unread items, sorts by weight and timestamp, then returns the top `n` results.

## Sorting Notes
- Timestamp strings are parsed using standard date parsing.
- Sorting is deterministic and stable for identical timestamps and weights.

## Logging Strategy
The logging middleware keeps an in-memory array of structured entries:
- `id`, `timestamp`, `level`, `message`, `context`

The UI Developer Console reads the log store and renders the latest entries in a table.

## Mock Authentication
The service layer provides an `Authorization: Bearer campus-static-token` header for every request. This demonstrates readiness for an authenticated backend without real credentials.

## Extensibility
- Replace the mock service with real API calls.
- Persist read state to the backend.
- Expand filters or add search by keyword.
- Stream logs to a remote observability service when available.
