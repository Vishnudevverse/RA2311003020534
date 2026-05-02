const logStore = []

const Log = (payload = {}) => {
  const entry = {
    id: `${Date.now()}-${logStore.length + 1}`,
    timestamp: new Date().toISOString(),
    level: payload.level || 'info',
    message: payload.message || 'Log entry',
    context: payload.context || null,
  }

  logStore.push(entry)
  return entry
}

const getLogs = () => logStore.slice().reverse()

const clearLogs = () => {
  logStore.length = 0
}

export { Log, getLogs, clearLogs }
