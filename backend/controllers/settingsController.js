const thresholds = require('../utils/thresholds')

exports.get = (req, res) => {
  res.json({ thresholds })
}

exports.update = (req, res) => {
  const incoming = req.body?.thresholds || req.body || {}
  if (typeof incoming.latency?.warning === 'number') thresholds.latency.warning = incoming.latency.warning
  if (typeof incoming.latency?.critical === 'number') thresholds.latency.critical = incoming.latency.critical
  if (typeof incoming.packetLoss?.warning === 'number') thresholds.packetLoss.warning = incoming.packetLoss.warning
  if (typeof incoming.packetLoss?.critical === 'number') thresholds.packetLoss.critical = incoming.packetLoss.critical
  if (typeof incoming.cpu?.warning === 'number') thresholds.cpu.warning = incoming.cpu.warning
  if (typeof incoming.cpu?.critical === 'number') thresholds.cpu.critical = incoming.cpu.critical
  if (typeof incoming.memory?.warning === 'number') thresholds.memory.warning = incoming.memory.warning
  if (typeof incoming.memory?.critical === 'number') thresholds.memory.critical = incoming.memory.critical
  if (typeof incoming.throughput?.warning === 'number') thresholds.throughput.warning = incoming.throughput.warning
  if (typeof incoming.throughput?.critical === 'number') thresholds.throughput.critical = incoming.throughput.critical
  res.json({ thresholds })
}
