const thresholds = require('../utils/thresholds')

exports.get = (req, res) => {
  res.json({ thresholds })
}

exports.update = (req, res) => {
  const incoming = req.body?.thresholds || req.body || {}
  if (typeof incoming.latency === 'number') thresholds.latency = incoming.latency
  if (typeof incoming.packetLoss === 'number') thresholds.packetLoss = incoming.packetLoss
  if (typeof incoming.cpu === 'number') thresholds.cpu = incoming.cpu
  if (typeof incoming.memory === 'number') thresholds.memory = incoming.memory
  if (typeof incoming.throughputLow === 'number') thresholds.throughputLow = incoming.throughputLow
  res.json({ thresholds })
}
