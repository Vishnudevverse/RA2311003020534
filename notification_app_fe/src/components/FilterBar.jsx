const FILTERS = ['All', 'Placement', 'Result', 'Event']

const FilterBar = ({ activeFilter, onChange }) => {
  return (
    <div className="btn-group filter-bar" role="group" aria-label="Filter">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          type="button"
          className={`btn btn-sm ${
            activeFilter === filter ? 'btn-primary' : 'btn-outline-primary'
          }`}
          onClick={() => onChange(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  )
}

export default FilterBar
