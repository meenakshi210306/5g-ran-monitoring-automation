import { useEffect, useState } from 'react'
import { fetchThresholds, updateThresholds } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { canAccess, PERMISSIONS } from '../utils/rbac'

export default function Settings(){
  const { user } = useAuth()
  const canEdit = canAccess(user?.role, PERMISSIONS.EDIT_THRESHOLDS)
  const [latency, setLatency] = useState(100)
  const [packetLoss, setPacketLoss] = useState(5)
  const [cpu, setCpu] = useState(90)
  const [memory, setMemory] = useState(90)
  const [throughputLow, setThroughputLow] = useState(5)

  useEffect(() => {
    fetchThresholds().then(data => {
      const values = data.thresholds || {}
      setLatency(values.latency ?? 100)
      setPacketLoss(values.packetLoss ?? 5)
      setCpu(values.cpu ?? 90)
      setMemory(values.memory ?? 90)
      setThroughputLow(values.throughputLow ?? 5)
    }).catch(()=>{})
  }, [])

  const handleSave = async () => {
    await updateThresholds({ latency, packetLoss, cpu, memory, throughputLow })
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
          <div className="stat-card"><strong>Latency threshold</strong><div>{latency} ms</div></div>
          <div className="stat-card"><strong>Packet loss threshold</strong><div>{packetLoss}%</div></div>
          <div className="stat-card"><strong>CPU threshold</strong><div>{cpu}%</div></div>
          <div className="stat-card"><strong>Memory threshold</strong><div>{memory}%</div></div>
          <div className="stat-card"><strong>Throughput floor</strong><div>{throughputLow} Mbps</div></div>
        </div>
      </section>
    </div>
  )
}
