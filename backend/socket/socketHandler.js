const simulator = require('../simulators/nodeSimulator')

module.exports = function (io) {
  io.on('connection', socket => {
    // send current snapshot
    socket.emit('nodes', simulator.getNodes())
    socket.emit('alerts', simulator.getAlerts())

    // forward simulator updates to clients
    const onUpdate = (nodes) => socket.emit('nodes', nodes)
    const onAlerts = (alerts) => socket.emit('alerts', alerts)
    simulator.on('update', onUpdate)
    simulator.on('alerts', onAlerts)

    socket.on('disconnect', () => {
      simulator.removeListener('update', onUpdate)
      simulator.removeListener('alerts', onAlerts)
    })
  })
}
