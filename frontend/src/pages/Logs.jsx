import { useEffect, useState } from 'react'
import { fetchLogs, clearLogs } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { canAccess, PERMISSIONS } from '../utils/rbac'

export default function Logs(){
  const [logs, setLogs] = useState([])
  const { user } = useAuth()
  const canDeleteLogs = canAccess(user?.role, PERMISSIONS.DELETE_LOGS)

  const reloadLogs = () => fetchLogs().then(setLogs).catch(()=>{})

  useEffect(()=>{ fetchLogs().then(setLogs).catch(()=>{}) },[])

  const handleClearLogs = async () => {
    await clearLogs()
    await reloadLogs()
  }

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>Logs</h2>
            <p>Telecom-style network events, alerts, and recovery actions.</p>
          </div>
          {canDeleteLogs ? (
            <button type="button" className="ghost-button" onClick={handleClearLogs}>Delete logs</button>
          ) : null}
        </div>
        <div className="logs-box">
          <pre>{logs.length ? logs.join('\n') : 'No logs available yet. Trigger a threshold breach or restart to generate network.log entries.'}</pre>
        </div>
      </section>
    </div>
  )
}
