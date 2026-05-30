const API_URL = 'https://fiveg-ran-monitoring-automation.onrender.com'

function getToken(){
  return localStorage.getItem('5g-token') || ''
}

function authHeaders(){
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function requestJson(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`)
  }
  return data
}

export async function fetchNodes(){
  return requestJson('/api/nodes', { headers: authHeaders() })
}

export async function fetchLogs(){
  return requestJson('/api/logs', { headers: authHeaders() })
}

export async function fetchAlerts(){
  return requestJson('/api/alerts', { headers: authHeaders() })
}

export async function fetchAnalytics(){
  return requestJson('/api/analytics', { headers: authHeaders() })
}

export async function restartNode(nodeId){
  return requestJson(`/api/nodes/${nodeId}/restart`, {
    method: 'POST',
    headers: authHeaders()
  })
}

export async function clearLogs(){
  return requestJson('/api/logs', {
    method: 'DELETE',
    headers: authHeaders()
  })
}

export async function fetchThresholds(){
  return requestJson('/api/settings/thresholds', { headers: authHeaders() })
}

export async function updateThresholds(thresholds){
  return requestJson('/api/settings/thresholds', {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ thresholds })
  })
}

export async function fetchUsers(){
  return requestJson('/api/users', { headers: authHeaders() })
}

