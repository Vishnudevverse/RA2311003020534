import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { formatTimestamp } from '../utils/notificationUtils'

const DeveloperConsole = ({ logs, onClear }) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 3, py: 2 }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Developer Console
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Captured middleware logs for real-time actions.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            size="small"
            onClick={onClear}
            disabled={!logs.length}
          >
            Clear logs
          </Button>
        </Stack>
        <Divider />
        {logs.length ? (
          <Box sx={{ overflowX: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  <TableCell>Source</TableCell>
                  <TableCell>Level</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Message</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {formatTimestamp(entry.timestamp)}
                    </TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{entry.source}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{entry.level}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>
                      {entry.category}
                    </TableCell>
                    <TableCell>{entry.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ p: 3 }}>
            No logs yet. Activity will appear here as notifications arrive or
            change state.
          </Typography>
        )}
      </Paper>
    </Box>
  )
}

export default DeveloperConsole
