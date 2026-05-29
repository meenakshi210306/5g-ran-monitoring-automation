module.exports = {
  cpu: 90,         // percent -> alert when >90%
  memory: 90,      // percent
  packetLoss: 5.0, // percent -> alert when >5%
  latency: 100,    // ms -> alert when >100ms
  throughputLow: 5 // Mbps - too low indicates problem
}
