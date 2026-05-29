const EventEmitter = require('events')
const thresholds = require('../utils/thresholds')
const logger = require('../utils/logger')

// Telecom node simulator for gNB, CU, DU, and eNB.
// The simulator keeps a live history so the dashboard can plot trends and
// the analytics controller can estimate predicted failures from rising latency.
class NodeSimulator extends EventEmitter {
  constructor() {
    super()
    this.nodes = []
    this.alerts = []
    this.interval = null
    this.historyLen = 24
    this._initNodes()
  }

  _initNodes() {
    const types = ['gNB', 'CU', 'DU', 'eNB']

    for (let i = 1; i <= 8; i++) {
      const type = types[(i - 1) % types.length]
      const metrics = {
        latency: this._rand(5, 20),
        throughput: this._rand(10, 500),
        packetLoss: this._rand(0, 1),
        cpu: this._rand(5, 40),
        memory: this._rand(10, 60)
      }

      const node = {
        id: `${type.toLowerCase()}-${i}`,
        type,
        status: 'up',
        uptimeSeconds: 0,
        lastRestartAt: null,
        createdAt: Date.now(),
        metrics,
        history: {
          latency: [],
          throughput: [],
          packetLoss: [],
          cpu: [],
          memory: [],
          uptime: []
        }
      }

      for (let h = 0; h < this.historyLen; h++) {
        node.history.latency.push(metrics.latency)
        node.history.throughput.push(metrics.throughput)
        node.history.packetLoss.push(metrics.packetLoss)
        node.history.cpu.push(metrics.cpu)
        node.history.memory.push(metrics.memory)
        node.history.uptime.push(0)
      }

      this.nodes.push(node)
    }
  }

  _rand(min, max) {
    return Math.random() * (max - min) + min
  }

  start(freqMs = 2000) {
    if (this.interval) return
    this.interval = setInterval(() => this._tick(), freqMs)
  }

  stop() {
    if (this.interval) clearInterval(this.interval)
    this.interval = null
  }

  _tick() {
    const newAlerts = []

    this.nodes.forEach(node => {
      if (node.status !== 'up') {
        this._pushHistory(node)
        return
      }

      node.uptimeSeconds += 2
      node.metrics.latency = Math.max(0, node.metrics.latency + (Math.random() - 0.5) * 10)
      node.metrics.throughput = Math.max(0, node.metrics.throughput + (Math.random() - 0.5) * 80)
      node.metrics.packetLoss = Math.max(0, node.metrics.packetLoss + (Math.random() - 0.5) * 1)
      node.metrics.cpu = Math.min(100, Math.max(0, node.metrics.cpu + (Math.random() - 0.5) * 12))
      node.metrics.memory = Math.min(100, Math.max(0, node.metrics.memory + (Math.random() - 0.5) * 8))

      this._pushHistory(node)

      if (node.metrics.latency > thresholds.latency) newAlerts.push({ node: node.id, metric: 'latency', value: node.metrics.latency })
      if (node.metrics.packetLoss > thresholds.packetLoss) newAlerts.push({ node: node.id, metric: 'packetLoss', value: node.metrics.packetLoss })
      if (node.metrics.cpu > thresholds.cpu) newAlerts.push({ node: node.id, metric: 'cpu', value: node.metrics.cpu })
      if (node.metrics.memory > thresholds.memory) newAlerts.push({ node: node.id, metric: 'memory', value: node.metrics.memory })
      if (node.metrics.throughput < thresholds.throughputLow) newAlerts.push({ node: node.id, metric: 'throughputLow', value: node.metrics.throughput })
    })

    newAlerts.forEach(alert => this._createAlert(alert))
    this.emit('update', this.getNodes())
    if (this.alerts.length) this.emit('alerts', this.getAlerts())
  }

  _pushHistory(node) {
    node.history.latency.push(node.metrics.latency)
    node.history.throughput.push(node.metrics.throughput)
    node.history.packetLoss.push(node.metrics.packetLoss)
    node.history.cpu.push(node.metrics.cpu)
    node.history.memory.push(node.metrics.memory)
    node.history.uptime.push(node.uptimeSeconds)

    if (node.history.latency.length > this.historyLen) node.history.latency.shift()
    if (node.history.throughput.length > this.historyLen) node.history.throughput.shift()
    if (node.history.packetLoss.length > this.historyLen) node.history.packetLoss.shift()
    if (node.history.cpu.length > this.historyLen) node.history.cpu.shift()
    if (node.history.memory.length > this.historyLen) node.history.memory.shift()
    if (node.history.uptime.length > this.historyLen) node.history.uptime.shift()
  }

  _createAlert(raw) {
    const now = new Date().toISOString()
    let friendly = ''
    if (raw.metric === 'throughputLow') friendly = `throughput low (${raw.value.toFixed(1)} Mbps)`
    else if (raw.metric === 'packetLoss') friendly = `packet loss ${raw.value.toFixed(2)}%`
    else if (raw.metric === 'latency') friendly = `latency ${raw.value.toFixed(1)} ms`
    else if (raw.metric === 'cpu') friendly = `cpu ${raw.value.toFixed(1)}%`
    else if (raw.metric === 'memory') friendly = `memory ${raw.value.toFixed(1)}%`
    else friendly = `${raw.metric} ${raw.value}`

    const message = `${raw.node} ${friendly} exceeded threshold`
    const alert = { id: `${raw.node}-${Date.now()}`, node: raw.node, metric: raw.metric, value: raw.value, time: now, message }

    const recent = this.alerts.find(item => item.node === alert.node && item.metric === alert.metric && (Date.now() - new Date(item.time).getTime()) < 60_000)
    if (!recent) {
      this.alerts.push(alert)
      if (this.alerts.length > 500) this.alerts.shift()
      logger.log('ERROR', message)
    }
  }

  getNodes() {
    return this.nodes.map(node => ({
      id: node.id,
      type: node.type,
      status: node.status,
      uptimeSeconds: node.uptimeSeconds,
      lastRestartAt: node.lastRestartAt,
      createdAt: node.createdAt,
      metrics: { ...node.metrics },
      history: {
        latency: [...node.history.latency],
        throughput: [...node.history.throughput],
        packetLoss: [...node.history.packetLoss],
        cpu: [...node.history.cpu],
        memory: [...node.history.memory],
        uptime: [...node.history.uptime]
      }
    }))
  }

  getAlerts() {
    return this.alerts.slice().reverse()
  }

  restartNode(nodeId) {
    const node = this.nodes.find(item => item.id === nodeId)
    if (!node) return false
    if (node.status === 'restarting') return true

    node.status = 'restarting'
    logger.log('INFO', `Restarting node ${nodeId}`)

    setTimeout(() => {
      node.status = 'up'
      node.uptimeSeconds = 0
      node.lastRestartAt = Date.now()
      node.metrics.cpu = Math.max(1, node.metrics.cpu * 0.5)
      node.metrics.packetLoss = Math.max(0, node.metrics.packetLoss * 0.2)
      logger.log('INFO', `Node ${nodeId} restarted`)
      this.emit('update', this.getNodes())
    }, 3000 + Math.random() * 4000)

    return true
  }
}

const simulator = new NodeSimulator()
simulator.start()

module.exports = simulator
