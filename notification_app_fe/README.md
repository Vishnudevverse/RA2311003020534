# Campus Connect (Frontend)

## Setup

```bash
npm install
npm run dev
```

## Notes

- UI uses Material UI (MUI).
- Auth context seeds a mock token and user into local storage on load.
- Real-time notifications are simulated in `src/services/notificationSim.js`.
- Logging is handled by the reusable middleware package in `../logging_middleware`.
