import { useAuth } from '../context/AuthContext'
import { canAccess, PERMISSIONS } from '../utils/rbac'
import { restartNode } from '../services/api'
import { getMetricStatus, getMetricTone, getNodeStatus } from '../utils/metricStatus'

export default function NodeCard({node}){
  const { user } = useAuth()
  const isRestarting = node.status === 'restarting'
  const health = getNodeStatus(node)
  const statusColor = isRestarting
    ? '#e0f2fe'
    : health === 'critical'
      ? '#fee2e2'
      : health === 'warning'
        ? '#fef3c7'
        : health === 'no-data'
          ? '#e2e8f0'
          : '#dcfce7'
  const border = isRestarting
    ? '2px solid #0284c7'
    : health === 'critical'
      ? '2px solid #dc3545'
      : health === 'warning'
        ? '2px solid #d97706'
        : health === 'no-data'
          ? '2px solid #64748b'
          : '1px solid rgba(255,255,255,0.08)'
  const statusTone = isRestarting ? '#075985' : getMetricTone(health)
  const metricRows = [
    { label: 'Latency', key: 'latency', suffix: 'ms' },
    { label: 'Throughput', key: 'throughput', suffix: 'Mbps' },
    { label: 'Packet Loss', key: 'packetLoss', suffix: '%' },
    { label: 'CPU', key: 'cpu', suffix: '%' },
    { label: 'Memory', key: 'memory', suffix: '%' }
  ]

  const handleRestart = async () => {
    await restartNode(node.id)
  }

  const renderMetric = ({ label, key, suffix }) => {
    const value = node.metrics[key]
    const status = getMetricStatus(key, value)
    const tone = getMetricTone(status)
    const displayValue = status === 'no-data'
      ? 'No data'
      : key === 'packetLoss'
        ? `${Number(value || 0).toFixed(2)}${suffix}`
        : `${Number(value || 0).toFixed(1)} ${suffix}`

    return (
      <div className="metric-line" key={key}>
        <span className="metric-label">{label}</span>
        <span className="metric-value metric-value-wrap">
          <span className={`metric-dot metric-dot-${status}`} style={{ background: tone }} />
          <span>{displayValue}</span>
        </span>
      </div>
    )
  }

  return (
    <div className="node-card" style={{background: statusColor, border}}>
      <h3>{node.id} <small style={{fontSize:12, marginLeft:8}}>{node.type}</small></h3>
      {metricRows.map(renderMetric)}
      <div className="metric-line"><span className="metric-label">Uptime</span><span className="metric-value">{Math.floor((node.uptimeSeconds || 0) / 60)}m {((node.uptimeSeconds || 0) % 60).toFixed(0)}s</span></div>
      <div className="node-status" style={{color: statusTone, background: 'rgba(255,255,255,0.72)'}}>
        {(isRestarting ? 'RESTARTING' : health.toUpperCase())} • {node.status}{health === 'critical' ? ' • ALERT' : ''}
      </div>
      {canAccess(user?.role, PERMISSIONS.RESTART_NODE) ? (
        <button className="primary-button" type="button" onClick={handleRestart} disabled={isRestarting} style={{marginTop: 14, width: '100%'}}>
          {isRestarting ? 'Restarting...' : 'Restart node'}
        </button>
      ) : null}
    </div>
  )
}
