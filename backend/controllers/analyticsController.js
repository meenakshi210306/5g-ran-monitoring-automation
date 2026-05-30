const simulator = require('../simulators/nodeSimulator')
const thresholds = require('../utils/thresholds')

function trendScore(values) {
  if (!values || values.length < 4) return 0
  const recent = values.slice(-4)
  return recent[3] - recent[0]
}

function nodeHealth(node) {
  const latency = node.metrics.latency
  if (latency === 0 || latency === null || latency === undefined) return 'no-data'

  const states = [
    latency > thresholds.latency.critical ? 'critical' : latency > thresholds.latency.warning ? 'warning' : 'healthy',
    node.metrics.packetLoss > thresholds.packetLoss.critical ? 'critical' : node.metrics.packetLoss > thresholds.packetLoss.warning ? 'warning' : 'healthy',
    node.metrics.cpu > thresholds.cpu.critical ? 'critical' : node.metrics.cpu > thresholds.cpu.warning ? 'warning' : 'healthy',
    node.metrics.memory > thresholds.memory.critical ? 'critical' : node.metrics.memory > thresholds.memory.warning ? 'warning' : 'healthy',
    node.metrics.throughput < thresholds.throughput.critical ? 'critical' : node.metrics.throughput < thresholds.throughput.warning ? 'warning' : 'healthy'
  ]

  if (states.includes('critical')) return 'critical'
  if (states.includes('warning')) return 'warning'
  return node.status === 'up' ? 'healthy' : 'warning'
}

function percentile(values, p) {
  if (!values.length) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil(p * sorted.length) - 1
  return sorted[Math.min(sorted.length - 1, Math.max(0, index))]
}

exports.summary = (req, res) => {
  const nodes = simulator.getNodes()
  const alerts = simulator.getAlerts()

  const latencyValues = nodes.map(node => node.metrics.latency).filter(value => typeof value === 'number' && value > 0)
  const averageLatency = latencyValues.length
    ? latencyValues.reduce((sum, value) => sum + value, 0) / latencyValues.length
    : 0
  const p95Latency = percentile(latencyValues, 0.95)

  const uptimePercent = nodes.length
    ? (nodes.filter(node => node.status === 'up').length / nodes.length) * 100
    : 0

  const totalFailures = simulator.getFailureEvents()

  const nodePerformance = nodes.map(node => ({
    id: node.id,
    type: node.type,
    status: node.status,
    health: nodeHealth(node),
    metrics: {
      latency: node.metrics.latency,
      throughput: node.metrics.throughput,
      packetLoss: node.metrics.packetLoss,
      cpu: node.metrics.cpu,
      memory: node.metrics.memory
    },
    uptimeSeconds: node.uptimeSeconds
  }))

  const predictedFailureAlerts = nodes
    .map(node => {
      const latencyTrend = trendScore(node.history.latency)
      const lossTrend = trendScore(node.history.packetLoss)
      const riskScore = Math.max(0, latencyTrend) + Math.max(0, lossTrend * 15) + (node.metrics.cpu > 85 ? 15 : 0)
      if (riskScore < 20) return null
      return {
        nodeId: node.id,
        type: node.type,
        riskScore: Number(riskScore.toFixed(1)),
        message: `${node.id} shows rising latency/loss trend; predicted failure risk is elevated`
      }
    })
    .filter(Boolean)

  res.json({
    averageLatency,
    p95Latency,
    uptimePercent,
    totalFailures,
    nodePerformance,
    predictedFailureAlerts,
    recentAlerts: alerts.slice(0, 10)
  })
}
