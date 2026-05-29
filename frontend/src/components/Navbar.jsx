import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function Navbar(){
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()

  return (
    <header className="header-bar panel">
      <div>
        <p className="eyebrow">5G Network Monitoring</p>
        <h1>Network Operations Dashboard</h1>
        <p className="subtitle">Live telecom node status, alerts, analytics, and topology in one place.</p>
      </div>

      <div className="header-actions">
        <button className="ghost-button" type="button" onClick={toggleTheme}>
          {theme === 'dark' ? 'Light mode' : 'Dark mode'}
        </button>
        <div className="role-badge">{user?.role || 'Guest'}</div>
        <button className="ghost-button" type="button" onClick={logout}>Logout</button>
      </div>
    </header>
  )
}
