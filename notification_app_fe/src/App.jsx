import { useCallback, useEffect, useMemo, useState } from 'react'
import { Log, getLogs, clearLogs } from 'logging-middleware'
import FilterBar from './components/FilterBar'
import NotificationCard from './components/NotificationCard'
import DeveloperConsole from './components/DeveloperConsole'
import { fetchNotifications, getAuthHeaders } from './services/notificationService'
import { getTopNotifications } from './utils/notificationUtils'
import './App.css'

const TOP_COUNT = 5

function App() {
  const [view, setView] = useState('dashboard')
  const [filter, setFilter] = useState('All')
  const [notifications, setNotifications] = useState([])
  const [logs, setLogs] = useState([])

  const syncLogs = useCallback(() => {
    setLogs(getLogs())
  }, [])

  const addLog = useCallback(
    (payload) => {
      Log(payload)
      syncLogs()
    },
    [syncLogs],
  )

  useEffect(() => {
    const loadNotifications = async () => {
      const data = await fetchNotifications()
      setNotifications(data)
      addLog({
        level: 'info',
        message: 'Notifications loaded',
        context: { count: data.length, auth: getAuthHeaders() },
      })
    }

    loadNotifications()
  }, [addLog])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  )

  const priorityNotifications = useMemo(
    () => getTopNotifications(TOP_COUNT, notifications),
    [notifications],
  )

  const filteredNotifications = useMemo(() => {
    if (filter === 'All') return notifications
    return notifications.filter((item) => item.type === filter)
  }, [notifications, filter])

  const handleViewChange = (nextView) => {
    setView(nextView)
    addLog({
      level: 'info',
      message: 'View changed',
      context: { view: nextView },
    })
  }

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter)
    addLog({
      level: 'info',
      message: 'Filter updated',
      context: { filter: nextFilter },
    })
  }

  const handleMarkRead = (id) => {
    const target = notifications.find((item) => item.id === id)
    if (!target || target.isRead) return

    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
    )

    addLog({
      level: 'info',
      message: 'Notification marked as read',
      context: { id },
    })
  }

  const handleClearLogs = () => {
    clearLogs()
    syncLogs()
  }

  const authReady = getAuthHeaders().Authorization

  return (
    <div className="app">
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container">
          <span className="navbar-brand d-flex align-items-center gap-2">
            <img
              src="/campus-logo.svg"
              className="brand-logo"
              width="28"
              height="28"
              alt="Campus Notifications logo"
            />
            Campus Notifications
          </span>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            <button
              type="button"
              className={`nav-link btn btn-link ${
                view === 'dashboard' ? 'active' : ''
              }`}
              onClick={() => handleViewChange('dashboard')}
            >
              Dashboard
            </button>
            <button
              type="button"
              className={`nav-link btn btn-link ${
                view === 'priority' ? 'active' : ''
              }`}
              onClick={() => handleViewChange('priority')}
            >
              Priority Inbox
            </button>
          </div>
        </div>
      </nav>

      <header className="hero-section">
        <div className="container">
          <div className="row g-4 align-items-center">
            <div className="col-lg-7">
              <p className="eyebrow">Campus Notifications Platform</p>
              <h1 className="hero-title">
                Priority-aware updates for placements, results, and events.
              </h1>
              <p className="lead text-muted">
                Stay aligned with the most important campus updates using a
                weight-based inbox, recency sorting, and a transparent activity
                log.
              </p>
            </div>
            <div className="col-lg-5">
              <div className="hero-card shadow-sm">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-2">
                  <span className="badge text-bg-success">Auth ready</span>
                  <span className="auth-text">{authReady}</span>
                </div>
                <div className="row g-3 mt-3">
                  <div className="col-4">
                    <div className="stat-card">
                      <p className="stat-label">Total</p>
                      <p className="stat-value">{notifications.length}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-card">
                      <p className="stat-label">Unread</p>
                      <p className="stat-value">{unreadCount}</p>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="stat-card">
                      <p className="stat-label">Priority</p>
                      <p className="stat-value">{priorityNotifications.length}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container main-content">
        {view === 'dashboard' ? (
          <section className="content-section">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
              <div>
                <h2 className="section-title">Dashboard</h2>
                <p className="text-muted mb-0">
                  Monitor all notifications and filter by category.
                </p>
              </div>
              <FilterBar activeFilter={filter} onChange={handleFilterChange} />
            </div>
            {filteredNotifications.length ? (
              filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))
            ) : (
              <div className="empty-state">
                <p className="mb-0">No notifications match this filter.</p>
              </div>
            )}
          </section>
        ) : (
          <section className="content-section">
            <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
              <div>
                <h2 className="section-title">Priority Inbox</h2>
                <p className="text-muted mb-0">
                  Unread items ranked by weight and recency.
                </p>
              </div>
              <span className="badge text-bg-primary">Top {TOP_COUNT}</span>
            </div>
            {priorityNotifications.length ? (
              priorityNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))
            ) : (
              <div className="empty-state">
                <p className="mb-0">No unread notifications at the moment.</p>
              </div>
            )}
          </section>
        )}

        <DeveloperConsole logs={logs} onClear={handleClearLogs} />
      </main>
    </div>
  )
}

export default App
