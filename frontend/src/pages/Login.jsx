import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SUGGESTIONS = [
  { role: 'Admin', username: 'admin', password: 'admin123' },
  { role: 'Network Engineer', username: 'engineer', password: 'engineer123' },
  { role: 'Viewer', username: 'viewer', password: 'viewer123' }
]

export default function Login(){
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(username, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Unable to sign in')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card panel">
        <div>
          <p className="eyebrow">Secure Access</p>
          <h2>5G Network Monitoring & Automation Dashboard</h2>
          <p className="subtitle">Sign in with a telecom operator role to monitor nodes, analytics, logs, and topology.</p>
        </div>

        <form className="login-form" onSubmit={submit}>
          <label>
            Username
            <input value={username} onChange={(e)=> setUsername(e.target.value)} placeholder="admin" />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="admin123" />
          </label>
          {error ? <div className="error-box">{error}</div> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Enter dashboard'}
          </button>
        </form>

        <div className="suggestion-grid">
          {SUGGESTIONS.map(item => (
            <button key={item.role} type="button" className="suggestion-card" onClick={() => { setUsername(item.username); setPassword(item.password) }}>
              <strong>{item.role}</strong>
              <span>{item.username} / {item.password}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
