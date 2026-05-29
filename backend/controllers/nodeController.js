const simulator = require('../simulators/nodeSimulator')

exports.list = (req, res) => {
  const nodes = simulator.getNodes()
  res.json(nodes)
}

exports.restart = (req, res) => {
  const id = req.params.id
  const ok = simulator.restartNode(id)
  if (!ok) return res.status(404).json({ error: 'node not found' })
  res.json({ status: 'restarting', node: id })
}
