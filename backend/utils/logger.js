const fs = require('fs')
const path = require('path')

const logsDir = path.join(__dirname, '..', '..', 'logs')
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true })
const networkLog = path.join(logsDir, 'network.log')
const MAX_BYTES = 1024 * 1024 // rotate after ~1MB

function _timestamp(){
  return new Date().toISOString()
}

function _rotateIfNeeded(){
  try{
    if (!fs.existsSync(networkLog)) return
    const st = fs.statSync(networkLog)
    if (st.size < MAX_BYTES) return
    const rotated = path.join(logsDir, `network.${new Date().toISOString().replace(/[:.]/g,'-')}.log`)
    fs.renameSync(networkLog, rotated)
  } catch(err){
    console.error('log rotation failed', err)
  }
}

// Telecom-style logger with timestamp and rotation
// Writes lines like: [2026-05-29T12:00:00.000Z] [ERROR] gNB-2 latency 123.4 ms exceeded threshold
exports.log = (level, msg) => {
  try {
    _rotateIfNeeded()
    const line = `[${_timestamp()}] [${level.toUpperCase()}] ${msg}\n`
    fs.appendFileSync(networkLog, line)
  } catch (err) {
    console.error('Failed to write log', err)
  }
}

exports.logFilePath = networkLog
exports.rotate = _rotateIfNeeded
