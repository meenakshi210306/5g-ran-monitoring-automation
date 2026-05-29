import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getVisibleNavItems } from '../utils/rbac'

export default function Sidebar(){
  const { user } = useAuth()
  const navItems = getVisibleNavItems(user?.role)

  return (
    <aside className="sidebar panel">
      <div className="sidebar-section">
        <p className="eyebrow">Navigation</p>
        {navItems.map(item => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'} className={({isActive}) => `sidebar-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </div>

      <div className="sidebar-section sidebar-meta">
        <p className="eyebrow">Session</p>
        <div className="sidebar-card">
          <div className="sidebar-label">Role</div>
          <div className="sidebar-value">{user?.role || 'Guest'}</div>
        </div>
        <div className="sidebar-card">
          <div className="sidebar-label">Operator</div>
          <div className="sidebar-value">{user?.username || 'Not signed in'}</div>
        </div>
      </div>
    </aside>
  )
}
