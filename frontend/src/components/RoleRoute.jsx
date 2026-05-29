import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { canAccess } from '../utils/rbac'
import AccessDenied from '../pages/AccessDenied'

export default function RoleRoute({permission}){
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  if (permission && !canAccess(user?.role, permission)) {
    return <AccessDenied />
  }

  return <Outlet />
}
