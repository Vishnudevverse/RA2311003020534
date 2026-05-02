import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from '@mui/material'
import { formatTimestamp } from '../utils/notificationUtils'

const TYPE_COLORS = {
  Placement: 'error',
  Result: 'info',
  Event: 'primary',
}

const NotificationCard = ({ notification, onMarkRead }) => {
  const isUnread = !notification.isRead
  const chipColor = TYPE_COLORS[notification.type] || 'default'

  return (
    <Card
      variant="outlined"
      sx={{
        mb: 2,
        borderLeftWidth: isUnread ? 4 : 1,
        borderLeftStyle: 'solid',
        borderLeftColor: isUnread ? 'primary.main' : 'divider',
        opacity: isUnread ? 1 : 0.7,
        filter: isUnread ? 'none' : 'grayscale(0.2)',
        boxShadow: isUnread ? 2 : 0,
      }}
    >
      <CardContent sx={{ pb: 1.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip label={notification.type} color={chipColor} size="small" />
            {isUnread && <Chip label="New" color="primary" size="small" />}
          </Stack>
          <Typography variant="caption" color="text.secondary">
            {isUnread ? 'Unread' : 'Viewed'}
          </Typography>
        </Stack>
        <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
          {notification.message}
        </Typography>
      </CardContent>
      <Divider />
      <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Typography variant="caption" color="text.secondary">
          {formatTimestamp(notification.timestamp)}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          onClick={() => onMarkRead(notification.id)}
          disabled={!isUnread}
        >
          Mark as Read
        </Button>
      </CardActions>
    </Card>
  )
}

export default NotificationCard
