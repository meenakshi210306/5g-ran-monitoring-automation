import { io } from 'socket.io-client'

const BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001'
const socket = io(BASE)

export function onNodes(cb){
  socket.on('nodes', cb)
}

export function onAlerts(cb){
  socket.on('alerts', cb)
}

export function reconnect(){
  if(!socket.connected) socket.connect()
}

export default socket
