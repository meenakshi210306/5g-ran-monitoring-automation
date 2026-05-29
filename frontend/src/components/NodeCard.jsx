import { useAuth } from '../context/AuthContext'
import { canAccess, PERMISSIONS } from '../utils/rbac'
import { restartNode } from '../services/api'

export default function NodeCard({node, hasAlert=false}){
  const { user } = useAuth()
  const health = hasAlert || node.metrics.latency > 100 || node.metrics.packetLoss > 5 || node.metrics.cpu > 90
    ? 'critical'
    : node.metrics.latency > 75 || node.metrics.packetLoss > 3 || node.metrics.cpu > 80
      ? 'warning'
      : 'healthy'
  const statusColor = health === 'critical' ? '#fee2e2' : health === 'warning' ? '#fef3c7' : '#dcfce7'
  const border = hasAlert ? '2px solid #dc3545' : '1px solid rgba(255,255,255,0.08)'
  const statusTone = health === 'critical' ? '#b91c1c' : health === 'warning' ? '#92400e' : '#166534'

  const handleRestart = async () => {
    await restartNode(node.id)
  }

  return (
    <div className="node-card" style={{background: statusColor, border}}>
      <h3>{node.id} <small style={{fontSize:12, marginLeft:8}}>{node.type}</small></h3>
      <div className="metric-line"><span className="metric-label">Latency</span><span className="metric-value">{node.metrics.latency.toFixed(1)} ms</span></div>
      <div className="metric-line"><span className="metric-label">Throughput</span><span className="metric-value">{node.metrics.throughput.toFixed(1)} Mbps</span></div>
      <div className="metric-line"><span className="metric-label">Packet Loss</span><span className="metric-value">{node.metrics.packetLoss.toFixed(2)}%</span></div>
      <div className="metric-line"><span className="metric-label">CPU</span><span className="metric-value">{node.metrics.cpu.toFixed(1)}%</span></div>
      <div className="metric-line"><span className="metric-label">Memory</span><span className="metric-value">{node.metrics.memory.toFixed(1)}%</span></div>
      <div className="metric-line"><span className="metric-label">Uptime</span><span className="metric-value">{Math.floor((node.uptimeSeconds || 0) / 60)}m {((node.uptimeSeconds || 0) % 60).toFixed(0)}s</span></div>
      <div className="node-status" style={{color: statusTone, background: 'rgba(255,255,255,0.72)'}}>
        {health.toUpperCase()} • {node.status}{hasAlert ? ' • ALERT' : ''}
      </div>
      {canAccess(user?.role, PERMISSIONS.RESTART_NODE) ? (
        <button className="primary-button" type="button" onClick={handleRestart} style={{marginTop: 14, width: '100%'}}>
          Restart node
        </button>
      ) : null}
    </div>
  )
}
