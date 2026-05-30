import { useEffect, useState } from 'react'
import TrafficChart from '../components/TrafficChart'
import AlertPanel from '../components/AlertPanel'
import StatusTable from '../components/StatusTable'
import { fetchNodes, fetchAnalytics } from '../services/api'
import { getNodeStatus } from '../utils/metricStatus'

export default function Analytics(){
  const [nodes, setNodes] = useState([])
  const [analytics, setAnalytics] = useState({ predictedFailureAlerts: [] })

  useEffect(()=>{ fetchNodes().then(setNodes).catch(()=>{}) },[])
  useEffect(()=>{ fetchAnalytics().then(setAnalytics).catch(()=>{}) },[])

  const avgLatency = analytics.averageLatency ?? (() => {
    const latencies = nodes.map(node => Number(node.metrics?.latency || 0)).filter(value => value > 0)
    if (!latencies.length) return 0
    return latencies.reduce((sum, value) => sum + value, 0) / latencies.length
  })()
  const p95Latency = analytics.p95Latency ?? (() => {
    const latencies = nodes.map(node => Number(node.metrics?.latency || 0)).filter(value => value > 0)
    if (!latencies.length) return 0
    const sorted = [...latencies].sort((a, b) => a - b)
    const index = Math.ceil(sorted.length * 0.95) - 1
    return sorted[Math.max(0, Math.min(sorted.length - 1, index))]
  })()
  const uptimePercent = analytics.uptimePercent ?? (nodes.length ? (nodes.filter(n=>n.status==='up').length / nodes.length * 100) : 0)
  const totalFailures = analytics.totalFailures ?? 0
  const statusNodes = (analytics.nodePerformance || nodes).map(node => ({
    ...node,
    health: node.health || getNodeStatus(node)
  }))

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Analytics</h2>
            <p>Summaries of latency, uptime, failures, and node performance.</p>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <strong>Average latency</strong>
            <div>{avgLatency.toFixed(1)} ms</div>
          </div>
          <div className="stat-card">
            <strong>P95 latency</strong>
            <div>{p95Latency.toFixed(1)} ms</div>
          </div>
          <div className="stat-card">
            <strong>Uptime</strong>
            <div>{uptimePercent.toFixed(1)}%</div>
          </div>
          <div className="stat-card">
            <strong>Total failures</strong>
            <div>{totalFailures}</div>
          </div>
          <div className="stat-card">
            <strong>Active nodes</strong>
            <div>{nodes.length}</div>
          </div>
        </div>
      </section>

      <TrafficChart nodes={nodes} />

      <div className="panel">
        <div className="section-title">
          <div>
            <h4>Predicted Failure Alerts</h4>
            <p>Nodes with rising risk scores based on latency and packet-loss trends.</p>
          </div>
        </div>
        <AlertPanel alerts={analytics.predictedFailureAlerts || []} />
      </div>

      <StatusTable nodes={statusNodes} />
    </div>
  )
}
