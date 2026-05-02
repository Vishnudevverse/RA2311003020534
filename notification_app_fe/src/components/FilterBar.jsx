import { Tab, Tabs } from '@mui/material'

const FILTERS = ['All', 'Placement', 'Result', 'Event']

const FilterBar = ({ value, onChange }) => {
  return (
    <Tabs
      value={value}
      onChange={(_event, nextValue) => onChange(nextValue)}
      variant="scrollable"
      allowScrollButtonsMobile
      textColor="primary"
      indicatorColor="primary"
      aria-label="Notification filters"
      sx={{
        minHeight: 44,
        '& .MuiTabs-flexContainer': { gap: 8 },
        '& .MuiTab-root': { px: 2 },
      }}
    >
      {FILTERS.map((filter) => (
        <Tab key={filter} value={filter} label={filter} sx={{ minHeight: 44 }} />
      ))}
    </Tabs>
  )
}

export default FilterBar
