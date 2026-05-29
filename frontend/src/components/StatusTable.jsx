export default function StatusTable({nodes=[]}){
  const getMetrics = (node) => node.metrics || node

  return (
    <div className="panel">
      <div className="section-title">
        <div>
          <h4>Status Table</h4>
          <p>Quick readout of node health and operational metrics.</p>
        </div>
      </div>
      <table className="status-table">
        <thead>
          <tr><th>ID</th><th>Type</th><th>Health</th><th>Latency</th><th>Throughput</th><th>Packet Loss</th><th>CPU</th><th>Mem</th><th>Uptime</th></tr>
        </thead>
      <tbody>
        {nodes.map(n => {
          const metrics = getMetrics(n)
          return (
            <tr key={n.id}>
              <td>{n.id}</td>
              <td>{n.type}</td>
              <td><span className={`health-dot health-${n.health || 'healthy'}`}>{(n.health || 'healthy').toUpperCase()}</span></td>
              <td>{Number(metrics.latency || 0).toFixed(1)}</td>
              <td>{Number(metrics.throughput || 0).toFixed(1)}</td>
              <td>{Number(metrics.packetLoss || 0).toFixed(2)}%</td>
              <td>{Number(metrics.cpu || 0).toFixed(1)}%</td>
              <td>{Number(metrics.memory || 0).toFixed(1)}%</td>
              <td>{Math.floor((n.uptimeSeconds || 0) / 60)}m</td>
            </tr>
          )
        })}
      </tbody>
      </table>
    </div>
  )
}
