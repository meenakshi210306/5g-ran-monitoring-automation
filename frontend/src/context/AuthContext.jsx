import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { loginRequest, meRequest } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('5g-user')
    return raw ? JSON.parse(raw) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('5g-token') || '')

  useEffect(() => {
    if (token) localStorage.setItem('5g-token', token)
    else localStorage.removeItem('5g-token')
  }, [token])

  useEffect(() => {
    if (user) localStorage.setItem('5g-user', JSON.stringify(user))
    else localStorage.removeItem('5g-user')
  }, [user])

  useEffect(() => {
    if (!token || user) return
    meRequest(token).then(data => setUser(data.user)).catch(() => {
      setToken('')
      setUser(null)
    })
  }, [token, user])

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login: async (username, password) => {
      const response = await loginRequest(username, password)
      // Persist immediately so first dashboard requests include Authorization.
      localStorage.setItem('5g-token', response.token)
      localStorage.setItem('5g-user', JSON.stringify(response.user))
      setToken(response.token)
      setUser(response.user)
      return response.user
    },
    logout: () => {
      setToken('')
      setUser(null)
    }
  }), [token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(){
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
