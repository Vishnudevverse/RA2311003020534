# Logging Middleware

Reusable logging helper for the Campus Notifications Platform.

## Usage

```js
import { Log, getLogs, clearLogs } from 'logging-middleware'

Log({ level: 'info', message: 'Example', context: { action: 'demo' } })
const logs = getLogs()
clearLogs()
```
