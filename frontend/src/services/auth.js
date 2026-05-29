const BASE = import.meta.env.VITE_API_BASE || 'https://fiveg-ran-monitoring-automation.onrender.com'

export async function loginRequest(username, password){
  const response = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error || 'Login failed')
  }
  return response.json()
}

export async function meRequest(token){
  const response = await fetch(`${BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!response.ok) throw new Error('Session expired')
  return response.json()
}
