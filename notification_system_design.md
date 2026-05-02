# Campus Connect - System Design

## Overview
The system surfaces time-sensitive campus updates while prioritizing the highest-impact notifications for students. The solution is split into three parts:

- Frontend: Vite + React + Material UI application in `notification_app_fe/`.
- Logging middleware: Reusable log utility in `logging_middleware/`.
- Backend stub: Placeholder services in `notification_app_be/`.

## Data Flow
1. Auth context seeds a mock token and user profile into local storage.
2. Initial notifications are loaded from the simulation service.
3. A randomized timer uses `setInterval` to inject new notifications every 15-30 seconds.
4. Each new item is added to state as unread and logged through the middleware.
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
- `id`, `timestamp`, `source`, `level`, `category`, `message`

The UI Developer Console reads the log store and renders the latest entries in a table.

## Mock Authentication
`AuthContext` stores a `mockToken` and `userData` in local storage on load to simulate an authenticated session.

## Extensibility
- Replace the simulation service with real API calls or WebSocket feeds.
- Persist read state to the backend.
- Expand filters or add search by keyword.
- Stream logs to a remote observability service when available.
