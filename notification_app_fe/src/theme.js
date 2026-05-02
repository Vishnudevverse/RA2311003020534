import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1a5ed6' },
    secondary: { main: '#0f766e' },
    info: { main: '#0284c7' },
    success: { main: '#16a34a' },
    background: { default: '#f5f7fb', paper: '#ffffff' },
  },
  typography: {
    fontFamily: "'Source Sans 3', 'Segoe UI', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
})

export default theme
