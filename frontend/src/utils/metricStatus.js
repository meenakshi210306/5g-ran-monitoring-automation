export const METRIC_THRESHOLDS = {
  latency: { warning: 20, critical: 50 },
  packetLoss: { warning: 1, critical: 5 },
  cpu: { warning: 70, critical: 90 },
  memory: { warning: 75, critical: 90 },
  throughput: { warning: 20, critical: 5 }
}

export function getMetricStatus(metric, value) {
  if (metric === 'latency' && (value === 0 || value === null || value === undefined)) {
    return 'no-data'
  }

  if (value === null || value === undefined) {
    return 'no-data'
  }

  const threshold = METRIC_THRESHOLDS[metric]
  if (!threshold) return 'healthy'

  if (metric === 'throughput') {
    if (value < threshold.critical) return 'critical'
    if (value < threshold.warning) return 'warning'
    return 'healthy'
  }

  if (value > threshold.critical) return 'critical'
  if (value > threshold.warning) return 'warning'
  return 'healthy'
}

export function getNodeStatus(node = {}) {
  const metrics = node.metrics || {}
  const latencyStatus = getMetricStatus('latency', metrics.latency)
  if (latencyStatus === 'no-data') return 'no-data'

  const states = [
    latencyStatus,
    getMetricStatus('packetLoss', metrics.packetLoss),
    getMetricStatus('cpu', metrics.cpu),
    getMetricStatus('memory', metrics.memory),
    getMetricStatus('throughput', metrics.throughput)
  ]

  if (states.includes('critical')) return 'critical'
  if (states.includes('warning')) return 'warning'
  return node.status === 'up' ? 'healthy' : 'warning'
}

export function getMetricTone(status) {
  if (status === 'critical') return '#b91c1c'
  if (status === 'warning') return '#a16207'
  if (status === 'no-data') return '#64748b'
  return '#15803d'
}
