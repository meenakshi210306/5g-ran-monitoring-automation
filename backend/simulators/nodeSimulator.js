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
    this.failureEvents = 0
    this.interval = null
    this.historyLen = 24
    this.throughputProfiles = {
      gNB: { min: 140, max: 320 },
      CU: { min: 90, max: 200 },
      DU: { min: 70, max: 170 },
      eNB: { min: 35, max: 120 }
    }
    this._initNodes()
  }

  _createFailureTracker() {
    return {
      latency: { streak: 0, counted: false },
      packetLoss: { streak: 0, counted: false },
      cpu: { streak: 0, counted: false },
      memory: { streak: 0, counted: false },
      throughput: { streak: 0, counted: false }
    }
  }

  _initNodes() {
    const types = ['gNB', 'CU', 'DU', 'eNB']

    for (let i = 1; i <= 8; i++) {
      const type = types[(i - 1) % types.length]
      const profile = this.throughputProfiles[type]
      const metrics = {
        latency: this._rand(5, 20),
        throughput: this._rand(profile.min, profile.max),
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
        failureTracker: this._createFailureTracker(),
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

  _clamp(value, min, max) {
    return Math.min(max, Math.max(min, value))
  }

  _metricState(metric, value) {
    const config = thresholds[metric]
    if (metric === 'latency' && (value === 0 || value === null || value === undefined)) {
      return 'no-data'
    }
    if (value === null || value === undefined) return 'no-data'

    if (metric === 'throughput') {
      if (value < config.critical) return 'critical'
      if (value < config.warning) return 'warning'
      return 'healthy'
    }

    if (value > config.critical) return 'critical'
    if (value > config.warning) return 'warning'
    return 'healthy'
  }

  _registerFailure(node, metric, state) {
    const tracker = node.failureTracker?.[metric]
    if (!tracker) return

    if (state === 'critical') {
      tracker.streak += 1
      if (tracker.streak >= 3 && !tracker.counted) {
        tracker.counted = true
        this.failureEvents += 1
      }
      return
    }

    tracker.streak = 0
    tracker.counted = false
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
      const profile = this.throughputProfiles[node.type] || { min: 50, max: 150 }

      if (node.status !== 'up') {
        this._pushHistory(node)
        return
      }

      node.uptimeSeconds += 2
      node.metrics.latency = Math.max(0, node.metrics.latency + (Math.random() - 0.5) * 10)
      const congestionPenalty = Math.max(0, (node.metrics.cpu - 70) * 1.1 + node.metrics.packetLoss * 12 + Math.max(0, node.metrics.latency - 60) * 0.25)
      const throughputNoise = (Math.random() - 0.5) * (profile.max - profile.min) * 0.12
      node.metrics.throughput = this._clamp(
        node.metrics.throughput + throughputNoise - congestionPenalty,
        profile.min * 0.45,
        profile.max
      )
      node.metrics.packetLoss = Math.max(0, node.metrics.packetLoss + (Math.random() - 0.5) * 1)
      node.metrics.cpu = Math.min(100, Math.max(0, node.metrics.cpu + (Math.random() - 0.5) * 12))
      node.metrics.memory = Math.min(100, Math.max(0, node.metrics.memory + (Math.random() - 0.5) * 8))

      this._pushHistory(node)

      const metricStates = {
        latency: this._metricState('latency', node.metrics.latency),
        packetLoss: this._metricState('packetLoss', node.metrics.packetLoss),
        cpu: this._metricState('cpu', node.metrics.cpu),
        memory: this._metricState('memory', node.metrics.memory),
        throughput: this._metricState('throughput', node.metrics.throughput)
      }

      Object.entries(metricStates).forEach(([metric, state]) => {
        this._registerFailure(node, metric, state)
      })

      if (metricStates.latency === 'critical') newAlerts.push({ node: node.id, metric: 'latency', value: node.metrics.latency })
      if (metricStates.packetLoss === 'critical') newAlerts.push({ node: node.id, metric: 'packetLoss', value: node.metrics.packetLoss })
      if (metricStates.cpu === 'critical') newAlerts.push({ node: node.id, metric: 'cpu', value: node.metrics.cpu })
      if (metricStates.memory === 'critical') newAlerts.push({ node: node.id, metric: 'memory', value: node.metrics.memory })
      if (metricStates.throughput === 'critical') newAlerts.push({ node: node.id, metric: 'throughput', value: node.metrics.throughput })
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
    if (raw.metric === 'throughput') friendly = `throughput ${raw.value.toFixed(1)} Mbps`
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

  getFailureEvents() {
    return this.failureEvents
  }

  restartNode(nodeId) {
    const node = this.nodes.find(item => item.id === nodeId)
    if (!node) return false
    if (node.status === 'restarting') return true

    node.status = 'restarting'
    logger.log('INFO', `Restarting node ${nodeId}`)
    this.emit('update', this.getNodes())

    setTimeout(() => {
      node.status = 'up'
      node.uptimeSeconds = 0
      node.lastRestartAt = Date.now()
      node.metrics.cpu = Math.max(1, node.metrics.cpu * 0.5)
      node.metrics.packetLoss = Math.max(0, node.metrics.packetLoss * 0.2)
      logger.log('INFO', `Node ${nodeId} restarted`)
      this.emit('update', this.getNodes())
    }, 800 + Math.random() * 400)

    return true
  }
}

const simulator = new NodeSimulator()
simulator.start()

module.exports = simulator
