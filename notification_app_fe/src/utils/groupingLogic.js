const getTimestampValue = (timestamp) => {
  const value = new Date(timestamp).valueOf()
  return Number.isNaN(value) ? 0 : value
}

const groupNotificationsByProvider = (notifications = []) => {
  const grouped = new Map()

  notifications.forEach((notification) => {
    const provider = notification.provider || 'Unknown Provider'
    if (!grouped.has(provider)) {
      grouped.set(provider, [])
    }
    grouped.get(provider).push(notification)
  })

  const groups = Array.from(grouped.entries()).map(([provider, items]) => {
    let placementPriority = 0

    items.forEach((item) => {
      const timeValue = getTimestampValue(item.timestamp)
      if (item.type === 'Placement' && timeValue > placementPriority) {
        placementPriority = timeValue
      }
    })

    return {
      provider,
      items: items
        .slice()
        .sort(
          (a, b) =>
            getTimestampValue(b.timestamp) - getTimestampValue(a.timestamp),
        ),
      unreadCount: items.filter((item) => !item.isRead).length,
      hasPlacement: placementPriority > 0,
      placementPriority,
    }
  })

  return groups.sort((a, b) => {
    if (a.placementPriority !== b.placementPriority) {
      return b.placementPriority - a.placementPriority
    }
    return a.provider.localeCompare(b.provider)
  })
}

export { groupNotificationsByProvider }
