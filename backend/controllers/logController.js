const fs = require('fs')
const logger = require('../utils/logger')

exports.list = (req, res) => {
  const file = logger.logFilePath
  if (!fs.existsSync(file)) return res.json([])
  const data = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).slice(-500)
  res.json(data)
}

exports.clear = (req, res) => {
  const file = logger.logFilePath
  fs.writeFileSync(file, '')
  res.json({ status: 'cleared' })
}
