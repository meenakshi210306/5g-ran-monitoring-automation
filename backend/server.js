require('dotenv').config()
const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const authRoutes = require('./routes/auth')
const analyticsRoutes = require('./routes/analytics')
const nodeRoutes = require('./routes/nodes')
const alertRoutes = require('./routes/alerts')
const logRoutes = require('./routes/logs')
const settingsRoutes = require('./routes/settings')
const usersRoutes = require('./routes/users')
const socketHandler = require('./socket/socketHandler')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
	res.send('5G RAN Monitoring Backend Running')
})

app.use('/api/auth', authRoutes)
app.use('/api/nodes', nodeRoutes)
app.use('/nodes', nodeRoutes)
app.use('/api/alerts', alertRoutes)
app.use('/api/logs', logRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/users', usersRoutes)

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

socketHandler(io)

const PORT = process.env.PORT || 5000

server.listen(PORT, () => {
	console.log(`Server running on ${PORT}`)
})
