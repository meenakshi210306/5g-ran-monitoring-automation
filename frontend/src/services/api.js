const API_URL = 'https://fiveg-ran-monitoring-automation.onrender.com'

function getToken(){
  return localStorage.getItem('5g-token') || ''
}

function authHeaders(){
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchNodes(){
  const res = await fetch(`${API_URL}/api/nodes`, { headers: authHeaders() })
  return res.json()
}

export async function fetchLogs(){
  const res = await fetch(`${API_URL}/api/logs`, { headers: authHeaders() })
  return res.json()
}

export async function fetchAlerts(){
  const res = await fetch(`${API_URL}/api/alerts`, { headers: authHeaders() })
  return res.json()
}

export async function fetchAnalytics(){
  const res = await fetch(`${API_URL}/api/analytics`, { headers: authHeaders() })
  return res.json()
}

export async function restartNode(nodeId){
  const res = await fetch(`${API_URL}/api/nodes/${nodeId}/restart`, {
    method: 'POST',
    headers: authHeaders()
  })
  return res.json()
}

export async function clearLogs(){
  const res = await fetch(`${API_URL}/api/logs`, {
    method: 'DELETE',
    headers: authHeaders()
  })
  return res.json()
}

export async function fetchThresholds(){
  const res = await fetch(`${API_URL}/api/settings/thresholds`, { headers: authHeaders() })
  return res.json()
}

export async function updateThresholds(thresholds){
  const res = await fetch(`${API_URL}/api/settings/thresholds`, {
    method: 'PUT',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ thresholds })
  })
  return res.json()
}

export async function fetchUsers(){
  const res = await fetch(`${API_URL}/api/users`, { headers: authHeaders() })
  return res.json()
}

