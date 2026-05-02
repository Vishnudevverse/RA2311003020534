import mockData from '../data/mockData.json'

const STATIC_TOKEN = 'campus-static-token'
const AUTH_HEADERS = {
  Authorization: `Bearer ${STATIC_TOKEN}`,
  'Content-Type': 'application/json',
}

const getAuthHeaders = () => ({ ...AUTH_HEADERS })

const fetchNotifications = async () => Promise.resolve(mockData)

export { fetchNotifications, getAuthHeaders }
