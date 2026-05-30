import { useEffect, useState } from 'react'
import { fetchThresholds, updateThresholds } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { canAccess, PERMISSIONS } from '../utils/rbac'

export default function Settings(){
  const { user } = useAuth()
  const canEdit = canAccess(user?.role, PERMISSIONS.EDIT_THRESHOLDS)
  const [thresholds, setThresholds] = useState({
    latency: { warning: 20, critical: 50 },
    packetLoss: { warning: 1, critical: 5 },
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 75, critical: 90 },
    throughput: { warning: 20, critical: 5 }
  })

  useEffect(() => {
    fetchThresholds().then(data => {
      const values = data.thresholds || {}
      setThresholds(prev => ({
        latency: {
          warning: values.latency?.warning ?? prev.latency.warning,
          critical: values.latency?.critical ?? prev.latency.critical
        },
        packetLoss: {
          warning: values.packetLoss?.warning ?? prev.packetLoss.warning,
          critical: values.packetLoss?.critical ?? prev.packetLoss.critical
        },
        cpu: {
          warning: values.cpu?.warning ?? prev.cpu.warning,
          critical: values.cpu?.critical ?? prev.cpu.critical
        },
        memory: {
          warning: values.memory?.warning ?? prev.memory.warning,
          critical: values.memory?.critical ?? prev.memory.critical
        },
        throughput: {
          warning: values.throughput?.warning ?? prev.throughput.warning,
          critical: values.throughput?.critical ?? prev.throughput.critical
        }
      }))
    }).catch(()=>{})
  }, [])

  const handleSave = async () => {
    await updateThresholds(thresholds)
  }

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Settings</h2>
            <p>Threshold configuration for telecom alerting rules.</p>
          </div>
          {canEdit ? <button className="primary-button" onClick={handleSave}>Save thresholds</button> : null}
        </div>
        <div className="stats-grid">
          <div className="stat-card"><strong>Latency</strong><div>Warning &gt; {thresholds.latency.warning} ms<br />Critical &gt; {thresholds.latency.critical} ms</div></div>
          <div className="stat-card"><strong>Packet Loss</strong><div>Warning &gt; {thresholds.packetLoss.warning}%<br />Critical &gt; {thresholds.packetLoss.critical}%</div></div>
          <div className="stat-card"><strong>CPU</strong><div>Warning &gt; {thresholds.cpu.warning}%<br />Critical &gt; {thresholds.cpu.critical}%</div></div>
          <div className="stat-card"><strong>Memory</strong><div>Warning &gt; {thresholds.memory.warning}%<br />Critical &gt; {thresholds.memory.critical}%</div></div>
          <div className="stat-card"><strong>Throughput</strong><div>Warning &lt; {thresholds.throughput.warning} Mbps<br />Critical &lt; {thresholds.throughput.critical} Mbps</div></div>
        </div>
      </section>
    </div>
  )
}
