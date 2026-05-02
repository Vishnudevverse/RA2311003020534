import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  ExpandMore as ExpandMoreIcon,
  NotificationsActive as NotificationsActiveIcon,
  PriorityHigh as PriorityHighIcon,
} from '@mui/icons-material'
import { Log, getLogs, clearLogs } from 'logging-middleware'
import FilterBar from './components/FilterBar'
import NotificationCard from './components/NotificationCard'
import DeveloperConsole from './components/DeveloperConsole'
import { formatTimestamp, getTopNotifications } from './utils/notificationUtils'
import { groupNotificationsByProvider } from './utils/groupingLogic'
import {
  getInitialNotifications,
  startNotificationSimulation,
} from './services/notificationSim'
import { useAuth } from './context/AuthContext.jsx'

const TOP_COUNT = 5
const TYPE_COLORS = {
  Placement: 'error',
  Result: 'info',
  Event: 'primary',
}

function App() {
  const initialNotifications = useMemo(() => getInitialNotifications(), [])
  const [view, setView] = useState('dashboard')
  const [filter, setFilter] = useState('All')
  const [notifications, setNotifications] = useState(initialNotifications)
  const [expandedGroups, setExpandedGroups] = useState(() => {
    const initialGroups = groupNotificationsByProvider(initialNotifications)
    return new Set(initialGroups.map((group) => group.provider))
  })
  const [logs, setLogs] = useState([])
  const { user, token } = useAuth()

  const syncLogs = useCallback(() => {
    setLogs(getLogs())
  }, [])

  useEffect(() => {
    const stopSimulation = startNotificationSimulation((notification) => {
      setNotifications((prev) => [notification, ...prev])
      Log('frontend', 'info', 'api', `New notification received: ${notification.id}`)
      syncLogs()
    })

    return stopSimulation
  }, [syncLogs])

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

  const groupedNotifications = useMemo(
    () => groupNotificationsByProvider(filteredNotifications),
    [filteredNotifications],
  )

  const visibleGroupKeys = useMemo(
    () => groupedNotifications.map((group) => group.provider),
    [groupedNotifications],
  )

  const allVisibleExpanded = useMemo(() => {
    if (!visibleGroupKeys.length) return false
    return visibleGroupKeys.every((key) => expandedGroups.has(key))
  }, [expandedGroups, visibleGroupKeys])

  const handleViewChange = (_event, nextView) => {
    if (nextView) {
      setView(nextView)
    }
  }

  const handleFilterChange = (nextFilter) => {
    setFilter(nextFilter)
  }

  const handleMarkRead = (id) => {
    let didUpdate = false

    setNotifications((prev) => {
      const target = prev.find((item) => item.id === id)
      if (!target || target.isRead) return prev

      didUpdate = true
      return prev.map((item) =>
        item.id === id ? { ...item, isRead: true } : item,
      )
    })

    if (didUpdate) {
      Log('frontend', 'info', 'user', `Marked as read: ${id}`)
      syncLogs()
    }
  }

  const handleToggleGroup = (provider, nextExpanded) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (nextExpanded) {
        next.add(provider)
      } else {
        next.delete(provider)
      }
      return next
    })

    Log(
      'frontend',
      'info',
      'user',
      `${nextExpanded ? 'Expanded' : 'Collapsed'} group: ${provider}`,
    )
    syncLogs()
  }

  const handleToggleAllGroups = () => {
    const nextExpanded = new Set(expandedGroups)

    if (allVisibleExpanded) {
      visibleGroupKeys.forEach((key) => nextExpanded.delete(key))
      Log('frontend', 'info', 'user', 'Collapsed all groups')
    } else {
      visibleGroupKeys.forEach((key) => nextExpanded.add(key))
      Log('frontend', 'info', 'user', 'Expanded all groups')
    }

    setExpandedGroups(nextExpanded)
    syncLogs()
  }

  const handleMarkGroupRead = (provider) => {
    setNotifications((prev) => {
      let didUpdate = false
      const next = prev.map((item) => {
        if (item.provider !== provider || item.isRead) return item
        didUpdate = true
        return { ...item, isRead: true }
      })
      return didUpdate ? next : prev
    })

    Log('frontend', 'info', 'user', `Marked group as read: ${provider}`)
    syncLogs()
  }

  const handleClearLogs = () => {
    clearLogs()
    syncLogs()
  }

  const tokenPreview =
    token && token.length > 12
      ? `${token.slice(0, 10)}...${token.slice(-4)}`
      : token

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" color="inherit" elevation={1}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ minHeight: 64, py: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                component="img"
                src="/campus-logo.svg"
                alt="Campus Connect logo"
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'common.white',
                  p: 0.5,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Campus Connect
              </Typography>
            </Stack>
            <Box sx={{ flexGrow: 1 }} />
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip
                icon={<NotificationsActiveIcon />}
                label="Live simulation"
                color="primary"
                variant="outlined"
                size="small"
              />
              <Chip
                label={user?.name || 'Campus User'}
                color="secondary"
                size="small"
              />
            </Stack>
          </Toolbar>
        </Container>
        <Divider />
        <Container maxWidth="lg">
          <Tabs
            value={view}
            onChange={handleViewChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ minHeight: 48 }}
          >
            <Tab
              value="dashboard"
              label="Dashboard"
              icon={<DashboardIcon />}
              iconPosition="start"
            />
            <Tab
              value="priority"
              label="Priority Inbox"
              icon={<PriorityHighIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Container>
      </AppBar>

      <Box
        sx={{
          py: { xs: 4, md: 6 },
          background:
            'linear-gradient(140deg, rgba(224, 240, 255, 0.9), rgba(248, 249, 255, 0.9))',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="overline"
                color="text.secondary"
                sx={{ letterSpacing: 2 }}
              >
                Campus Connect
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1.5 }}>
                Real-time campus updates with weighted priority logic.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
                Notifications are ranked by Placement, Result, and Event weight,
                then ordered by recency. New updates arrive automatically through
                the simulated engine.
              </Typography>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={0} variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Chip label="Authenticated" color="success" size="small" />
                    <Typography variant="caption" color="text.secondary">
                      Token stored in local storage
                    </Typography>
                  </Stack>
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: '"IBM Plex Mono", monospace', color: 'text.secondary' }}
                  >
                    {tokenPreview}
                  </Typography>
                  <Stack direction="row" spacing={3}>
                    <Badge
                      color="primary"
                      badgeContent={notifications.length}
                      showZero
                    >
                      <Typography variant="body2" component="span">
                        Total
                      </Typography>
                    </Badge>
                    <Badge color="secondary" badgeContent={unreadCount} showZero>
                      <Typography variant="body2" component="span">
                        Unread
                      </Typography>
                    </Badge>
                    <Badge
                      color="info"
                      badgeContent={priorityNotifications.length}
                      showZero
                    >
                      <Typography variant="body2" component="span">
                        Priority
                      </Typography>
                    </Badge>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {view === 'dashboard' ? (
          <Box>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Dashboard
                </Typography>
                <Typography color="text.secondary">
                  Filter by category to review all campus activity.
                </Typography>
              </Box>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={1.5}
                alignItems={{ xs: 'flex-start', md: 'center' }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  onClick={handleToggleAllGroups}
                  disabled={!groupedNotifications.length}
                >
                  {allVisibleExpanded ? 'Collapse All' : 'Expand All'}
                </Button>
                <Paper
                  variant="outlined"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 3,
                    bgcolor: 'background.paper',
                  }}
                >
                  <FilterBar value={filter} onChange={handleFilterChange} />
                </Paper>
              </Stack>
            </Stack>

            {groupedNotifications.length ? (
              <Stack spacing={2}>
                {groupedNotifications.map((group) => (
                  <Accordion
                    key={group.provider}
                    expanded={expandedGroups.has(group.provider)}
                    onChange={(_event, isExpanded) =>
                      handleToggleGroup(group.provider, isExpanded)
                    }
                    disableGutters
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      '&:before': { display: 'none' },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        bgcolor: group.hasPlacement
                          ? 'rgba(220, 38, 38, 0.06)'
                          : 'background.paper',
                        '& .MuiAccordionSummary-content': {
                          alignItems: 'center',
                          gap: 2,
                        },
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{ width: '100%' }}
                      >
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ flexGrow: 1 }}
                        >
                          <Badge
                            color="secondary"
                            badgeContent={group.unreadCount}
                            showZero
                          >
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                              {group.provider}
                            </Typography>
                          </Badge>
                          {group.hasPlacement && (
                            <Stack
                              direction="row"
                              spacing={0.5}
                              alignItems="center"
                            >
                              <PriorityHighIcon color="error" fontSize="small" />
                              <Typography
                                variant="caption"
                                sx={{ fontWeight: 600, color: 'error.main' }}
                              >
                                High Priority
                              </Typography>
                            </Stack>
                          )}
                        </Stack>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={(event) => {
                            event.preventDefault()
                            event.stopPropagation()
                            handleMarkGroupRead(group.provider)
                          }}
                        >
                          Mark group as read
                        </Button>
                      </Stack>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <List disablePadding>
                        {group.items.map((notification) => (
                          <ListItem
                            key={notification.id}
                            divider
                            alignItems="flex-start"
                            secondaryAction={
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleMarkRead(notification.id)}
                                disabled={notification.isRead}
                              >
                                Mark as read
                              </Button>
                            }
                            sx={{ py: 1.5 }}
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="subtitle2"
                                  sx={{
                                    fontWeight: notification.isRead ? 500 : 700,
                                  }}
                                >
                                  {notification.message}
                                </Typography>
                              }
                              secondary={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ mt: 0.5, flexWrap: 'wrap' }}
                                >
                                  <Chip
                                    label={notification.type}
                                    color={
                                      TYPE_COLORS[notification.type] || 'default'
                                    }
                                    size="small"
                                  />
                                  {!notification.isRead && (
                                    <Chip label="Unread" color="primary" size="small" />
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {formatTimestamp(notification.timestamp)}
                                  </Typography>
                                </Stack>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            ) : (
              <Paper
                variant="outlined"
                sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
              >
                No notifications match this filter.
              </Paper>
            )}
          </Box>
        ) : (
          <Box>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-start', md: 'center' }}
              spacing={2}
              sx={{ mb: 3 }}
            >
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  Priority Inbox
                </Typography>
                <Typography color="text.secondary">
                  Highest priority unread items based on weight and recency.
                </Typography>
              </Box>
              <Chip label={`Top ${TOP_COUNT}`} color="primary" />
            </Stack>

            {priorityNotifications.length ? (
              priorityNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkRead={handleMarkRead}
                />
              ))
            ) : (
              <Paper
                variant="outlined"
                sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}
              >
                No unread notifications at the moment.
              </Paper>
            )}
          </Box>
        )}

        <DeveloperConsole logs={logs} onClear={handleClearLogs} />
      </Container>
    </Box>
  )
}

export default App
