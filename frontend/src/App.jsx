import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import AppLayout from './layouts/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RoleRoute from './components/RoleRoute'
import { PERMISSIONS } from './utils/rbac'
import Dashboard from './pages/Dashboard'
import Logs from './pages/Logs'
import Analytics from './pages/Analytics'
import Topology from './pages/Topology'
import Automation from './pages/Automation'
import Settings from './pages/Settings'
import Users from './pages/Users'
import Login from './pages/Login'
import AccessDenied from './pages/AccessDenied'
import './styles.css'

function RootRedirect(){
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/' : '/login'} replace />
}

export default function App(){
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/denied" element={<AccessDenied />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_DASHBOARD} />}>
                  <Route path="/" element={<Dashboard />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_TOPOLOGY} />}>
                  <Route path="/topology" element={<Topology />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_ANALYTICS} />}>
                  <Route path="/analytics" element={<Analytics />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_LOGS} />}>
                  <Route path="/logs" element={<Logs />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_AUTOMATION} />}>
                  <Route path="/automation" element={<Automation />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.VIEW_SETTINGS} />}>
                  <Route path="/settings" element={<Settings />} />
                </Route>
                <Route element={<RoleRoute permission={PERMISSIONS.MANAGE_USERS} />}>
                  <Route path="/users" element={<Users />} />
                </Route>
              </Route>
            </Route>
            <Route path="*" element={<RootRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
