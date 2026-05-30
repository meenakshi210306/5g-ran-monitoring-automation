import { useEffect, useState } from 'react'
import NodeCard from '../components/NodeCard'
import StatusTable from '../components/StatusTable'
import { fetchNodes, fetchAnalytics, fetchAlerts } from '../services/api'
import { onNodes, onAlerts } from '../services/socket'
import AlertPanel from '../components/AlertPanel'
import TrafficChart from '../components/TrafficChart'

export default function Dashboard(){
  const [nodes, setNodes] = useState([])
  const [alerts, setAlerts] = useState([])
  const [analytics, setAnalytics] = useState({ predictedFailureAlerts: [] })

  useEffect(()=>{
    fetchNodes().then(data => setNodes(Array.isArray(data) ? data : [])).catch(()=>{})
    fetchAlerts().then(data => setAlerts(Array.isArray(data) ? data : [])).catch(()=>{})
    fetchAnalytics().then(data => setAnalytics(data && typeof data === 'object' ? data : { predictedFailureAlerts: [] })).catch(()=>{})
  },[])

  useEffect(()=>{
    onNodes((data)=> setNodes(Array.isArray(data) ? data : []))
    onAlerts((a)=> setAlerts(Array.isArray(a) ? a : []))
  },[])

  // compute set of nodes currently in alerts
  const alertNodeIds = new Set(alerts.map(a=>a.node))

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Live Dashboard</h2>
            <p>Overview of node health, active alerts, and real-time traffic metrics.</p>
          </div>
          <div style={{color:'#96a9c7'}}>Live updates via Socket.IO</div>
        </div>
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="section-title">
            <div>
              <h3>Node Status Cards</h3>
              <p>Red cards indicate alerts on the node.</p>
            </div>
          </div>
          <div className="cards-grid">
            {nodes.map(n => <NodeCard key={n.id} node={n} hasAlert={alertNodeIds.has(n.id)} />)}
          </div>
        </section>

        <div className="page-shell">
          <AlertPanel alerts={alerts} />
          <AlertPanel
            title="Predicted Failure Alerts"
            description="Basic ML-style trend detection for rising latency and packet loss."
            alerts={analytics.predictedFailureAlerts || []}
          />
          <TrafficChart nodes={nodes} />
        </div>
      </div>

      <StatusTable nodes={nodes.map(node => ({
        ...node,
        health: alerts.some(alert => alert.node === node.id) ? 'critical' : 'healthy'
      }))} />
    </div>
  )
}
