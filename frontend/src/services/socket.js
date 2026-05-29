import { io } from 'socket.io-client'

const socket = io('https://telecom-backend.onrender.com')

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
