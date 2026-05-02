const MIN_DELAY_MS = 15000
const MAX_DELAY_MS = 30000

const TYPES = ['Placement', 'Result', 'Event']

const PLACEMENT_PROVIDERS = [
  'Google',
  'Microsoft',
  'Nova Tech',
  'Orion Labs',
  'Apex Systems',
]
const RESULT_PROVIDER = 'Department/Examination Cell'
const EVENT_PROVIDERS = ['Student Council', 'Admin']

const PLACEMENT_MESSAGES = [
  'Campus Connect placement office opened new internship slots.',
  'Company Orion Labs is hiring for analyst roles.',
  'Final round interviews scheduled for Apex Systems.',
  'Offer letters ready for review in the placement portal.',
]

const RESULT_MESSAGES = [
  'Semester 2 results are now live for review.',
  'Lab assessment scores have been published.',
  'Scholarship eligibility results are available.',
  'Midterm grade updates posted for CS302.',
]

const EVENT_MESSAGES = [
  'Innovation summit registration closes tomorrow.',
  'Guest lecture on AI ethics is scheduled this Friday.',
  'Campus hackathon kickoff briefing begins at 4 PM.',
  'Career fair exhibitor list has been updated.',
]

const initialNotifications = [
  {
    id: 'NTF-1001',
    type: 'Placement',
    message: 'Placement drive for Nova Tech starts next week.',
    provider: 'Nova Tech',
    timestamp: '2026-05-02T08:15:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1002',
    type: 'Result',
    message: 'Midterm results published for CS302.',
    provider: RESULT_PROVIDER,
    timestamp: '2026-05-01T14:20:00Z',
    isRead: true,
  },
  {
    id: 'NTF-1003',
    type: 'Event',
    message: 'Innovation summit registration closes tomorrow.',
    provider: 'Student Council',
    timestamp: '2026-04-30T10:05:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1004',
    type: 'Placement',
    message: 'Resume shortlist for Orion Labs released.',
    provider: 'Orion Labs',
    timestamp: '2026-05-02T06:00:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1005',
    type: 'Result',
    message: 'Scholarship eligibility results available.',
    provider: RESULT_PROVIDER,
    timestamp: '2026-04-29T17:45:00Z',
    isRead: true,
  },
  {
    id: 'NTF-1006',
    type: 'Event',
    message: 'Hackathon kickoff briefing at Auditorium A.',
    provider: 'Admin',
    timestamp: '2026-05-01T09:00:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1007',
    type: 'Placement',
    message: 'Interview slots open for Apex Systems.',
    provider: 'Apex Systems',
    timestamp: '2026-05-01T16:30:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1008',
    type: 'Event',
    message: 'Career fair exhibitor list updated.',
    provider: 'Student Council',
    timestamp: '2026-04-28T11:15:00Z',
    isRead: true,
  },
  {
    id: 'NTF-1009',
    type: 'Result',
    message: 'Lab assessment scores are live.',
    provider: RESULT_PROVIDER,
    timestamp: '2026-05-02T07:20:00Z',
    isRead: false,
  },
  {
    id: 'NTF-1010',
    type: 'Event',
    message: 'Guest lecture on AI ethics this Friday.',
    provider: 'Admin',
    timestamp: '2026-05-01T12:10:00Z',
    isRead: false,
  },
]

const getRandomItem = (items) => items[Math.floor(Math.random() * items.length)]

const buildNotification = (type, message, provider) => {
  return {
    id: `NTF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    message,
    provider,
    timestamp: new Date().toISOString(),
    isRead: false,
  }
}

const createRandomNotification = () => {
  const type = getRandomItem(TYPES)
  const messageSets = {
    Placement: PLACEMENT_MESSAGES,
    Result: RESULT_MESSAGES,
    Event: EVENT_MESSAGES,
  }
  const providerSets = {
    Placement: PLACEMENT_PROVIDERS,
    Result: [RESULT_PROVIDER],
    Event: EVENT_PROVIDERS,
  }
  const message = getRandomItem(messageSets[type])
  const provider = getRandomItem(providerSets[type] || ['Admin'])
  return buildNotification(type, message, provider)
}

const getInitialNotifications = () =>
  initialNotifications.map((notification) => ({ ...notification }))

const startNotificationSimulation = (onNotification) => {
  let timerId = null
  let isActive = true

  const scheduleNext = () => {
    if (!isActive) return
    const delay =
      Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) +
      MIN_DELAY_MS

    timerId = setInterval(() => {
      if (!isActive) return
      const notification = createRandomNotification()
      if (typeof onNotification === 'function') {
        onNotification(notification)
      }
      clearInterval(timerId)
      scheduleNext()
    }, delay)
  }

  scheduleNext()

  return () => {
    isActive = false
    if (timerId) {
      clearInterval(timerId)
    }
  }
}

export { getInitialNotifications, startNotificationSimulation }
