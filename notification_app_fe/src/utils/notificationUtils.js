const TYPE_WEIGHTS = {
  Placement: 3,
  Result: 2,
  Event: 1,
}

const getTypeWeight = (type) => TYPE_WEIGHTS[type] ?? 0

const compareNotifications = (a, b) => {
  const weightDiff = getTypeWeight(b.type) - getTypeWeight(a.type)
  if (weightDiff !== 0) return weightDiff

  const timeDiff = new Date(b.timestamp).valueOf() - new Date(a.timestamp).valueOf()
  if (Number.isNaN(timeDiff)) return 0
  return timeDiff
}

const getTopNotifications = (n, items = []) => {
  return items
    .filter((item) => !item.isRead)
    .slice()
    .sort(compareNotifications)
    .slice(0, n)
}

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp)
  if (Number.isNaN(date.valueOf())) return timestamp
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export { TYPE_WEIGHTS, compareNotifications, getTopNotifications, formatTimestamp }
