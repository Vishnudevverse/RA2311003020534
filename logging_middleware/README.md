# Logging Middleware

Reusable logging helper for Campus Connect.

## Usage

```js
import { Log, getLogs, clearLogs } from 'logging-middleware'

Log('frontend', 'info', 'api', 'New notification received: ID-123')
const logs = getLogs()
clearLogs()
```
