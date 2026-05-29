const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'

function getToken(){
  return localStorage.getItem('5g-token') || ''
}

function authHeaders(){
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchNodes(){
  const res = await fetch(`${BASE}/api/nodes`, { headers: authHeaders() })
  return res.json()
}

export async function fetchLogs(){
  const res = await fetch(`${BASE}/api/logs`, { headers: authHeaders() })
  return res.json()
}

export async function fetchAlerts(){
  const res = await fetch(`${BASE}/api/alerts`, { headers: authHeaders() })
  return res.json()
}

export async function fetchAnalytics(){
  const res = await fetch(`${BASE}/api/analytics`, { headers: authHeaders() })
  return res.json()
}

export async function restartNode(nodeId){
  const res = await fetch(`${BASE}/api/nodes/${nodeId}/restart`, {
    method: 'POST',
    headers: authHeaders()
  })
  return res.json()
}

export async function clearLogs(){
  const res = await fetch(`${BASE}/api/logs`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return res.json()
}

export async function fetchThresholds(){
  const res = await fetch(`${BASE}/api/settings/thresholds`, { headers: authHeaders() })
  return res.json()
}

export async function updateThresholds(thresholds){
  const res = await fetch(`${BASE}/api/settings/thresholds`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ thresholds })
  })
  return res.json()
}

export async function fetchUsers(){
  const res = await fetch(`${BASE}/api/users`, { headers: authHeaders() })
  return res.json()
}

