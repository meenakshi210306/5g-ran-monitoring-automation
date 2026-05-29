import { useEffect, useState } from 'react'
import TrafficChart from '../components/TrafficChart'
import AlertPanel from '../components/AlertPanel'
import StatusTable from '../components/StatusTable'
import { fetchNodes, fetchLogs, fetchAnalytics } from '../services/api'

export default function Analytics(){
  const [nodes, setNodes] = useState([])
  const [logs, setLogs] = useState([])
  const [analytics, setAnalytics] = useState({ predictedFailureAlerts: [] })

  useEffect(()=>{ fetchNodes().then(setNodes).catch(()=>{}) },[])
  useEffect(()=>{ fetchLogs().then(setLogs).catch(()=>{}) },[])
  useEffect(()=>{ fetchAnalytics().then(setAnalytics).catch(()=>{}) },[])

  const avgLatency = analytics.averageLatency ?? (nodes.length ? (nodes.reduce((s,n)=> s + (n.metrics?.latency||0),0) / nodes.length) : 0)
  const uptimePercent = analytics.uptimePercent ?? (nodes.length ? (nodes.filter(n=>n.status==='up').length / nodes.length * 100) : 0)
  const totalFailures = (logs||[]).filter(l=> l.includes('[ERROR]') || l.toLowerCase().includes('restart')).length

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

      <StatusTable nodes={analytics.nodePerformance || nodes} />
    </div>
  )
}
