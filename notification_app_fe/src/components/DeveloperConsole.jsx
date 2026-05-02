const DeveloperConsole = ({ logs, onClear }) => {
  return (
    <section className="developer-console">
      <div className="card shadow-sm">
        <div className="card-header d-flex flex-wrap align-items-center justify-content-between gap-2">
          <div>
            <h3 className="h6 mb-1">Developer Console</h3>
            <p className="small text-muted mb-0">
              Captured logs from the middleware.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={onClear}
            disabled={!logs.length}
          >
            Clear logs
          </button>
        </div>
        <div className="card-body p-0">
          {logs.length ? (
            <div className="table-responsive">
              <table className="table table-sm table-striped mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Time</th>
                    <th scope="col">Level</th>
                    <th scope="col">Message</th>
                    <th scope="col">Context</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((entry) => (
                    <tr key={entry.id}>
                      <td className="text-muted small">{entry.timestamp}</td>
                      <td className="text-muted small">{entry.level}</td>
                      <td>{entry.message}</td>
                      <td>
                        <span className="log-context">
                          {entry.context ? JSON.stringify(entry.context) : '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="small text-muted px-3 py-3 mb-0">
              No logs yet. Activity will appear here as actions are taken.
            </p>
          )}
        </div>
      </div>
    </section>
  )
}

export default DeveloperConsole
