import { Link } from 'react-router-dom'

export default function AccessDenied(){
  return (
    <div className="login-page">
      <div className="login-card panel">
        <div>
          <p className="eyebrow">Access Control</p>
          <h2>Access Denied</h2>
          <p className="subtitle">Your current role does not allow access to this area. Contact an Admin if you need additional permissions.</p>
        </div>
        <Link to="/" className="primary-button" style={{display:'inline-flex', justifyContent:'center'}}>Return to dashboard</Link>
      </div>
    </div>
  )
}
