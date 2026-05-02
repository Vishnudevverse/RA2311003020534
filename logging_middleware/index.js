const logStore = []

const normalizeLogArgs = (source, level, category, message) => {
  if (typeof source === 'object' && source !== null) {
    return {
      source: source.source || 'frontend',
      level: source.level || 'info',
      category: source.category || 'app',
      message: source.message || 'Log entry',
    }
  }

  return {
    source: source || 'frontend',
    level: level || 'info',
    category: category || 'app',
    message: message || 'Log entry',
  }
}

const Log = (source, level, category, message) => {
  const normalized = normalizeLogArgs(source, level, category, message)
  const entry = {
    id: `${Date.now()}-${logStore.length + 1}`,
    timestamp: new Date().toISOString(),
    ...normalized,
  }

  logStore.push(entry)
  return entry
}

const getLogs = () => logStore.slice().reverse()

const clearLogs = () => {
  logStore.length = 0
}

export { Log, getLogs, clearLogs }
