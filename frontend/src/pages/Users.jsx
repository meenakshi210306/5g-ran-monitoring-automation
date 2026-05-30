import { useEffect, useState } from 'react'
import { fetchUsers } from '../services/api'

const fallbackUsers = [
  { username: 'admin', role: 'Admin', status: 'active' },
  { username: 'engineer', role: 'Network Engineer', status: 'active' },
  { username: 'viewer', role: 'Viewer', status: 'active' }
]

export default function Users(){
  const [users, setUsers] = useState(fallbackUsers)

  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(Array.isArray(data) ? data : fallbackUsers))
      .catch(() => setUsers(fallbackUsers))
  }, [])

  return (
    <div className="page-shell">
      <section className="panel">
        <div className="section-title">
          <div>
            <h2>User Management</h2>
            <p>Admin-only operator inventory for dashboard access.</p>
          </div>
        </div>
        <div className="logs-box">
          <pre>{users.map(user => `${user.username} | ${user.role} | ${user.status}`).join('\n')}</pre>
        </div>
      </section>
    </div>
  )
}
