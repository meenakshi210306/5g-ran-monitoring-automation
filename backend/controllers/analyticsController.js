const simulator = require('../simulators/nodeSimulator')

function trendScore(values) {
  if (!values || values.length < 4) return 0
  const recent = values.slice(-4)
  return recent[3] - recent[0]
}

function nodeHealth(node) {
  const highLatency = node.metrics.latency > 100
  const highLoss = node.metrics.packetLoss > 5
  const highCpu = node.metrics.cpu > 90
  const critical = [highLatency, highLoss, highCpu].filter(Boolean).length
  if (critical >= 2) return 'critical'
  if (critical === 1) return 'warning'
  return node.status === 'up' ? 'healthy' : 'warning'
}

exports.summary = (req, res) => {
  const nodes = simulator.getNodes()
  const alerts = simulator.getAlerts()

  const averageLatency = nodes.length
    ? nodes.reduce((sum, node) => sum + node.metrics.latency, 0) / nodes.length
    : 0

  const uptimePercent = nodes.length
    ? (nodes.filter(node => node.status === 'up').length / nodes.length) * 100
    : 0

  const totalFailures = alerts.length

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
    uptimePercent,
    totalFailures,
    nodePerformance,
    predictedFailureAlerts,
    recentAlerts: alerts.slice(0, 10)
  })
}
