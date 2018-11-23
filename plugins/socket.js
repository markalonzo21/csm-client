import io from 'socket.io-client'

export default function(ctx, inject) {
  console.log({ API_URL: process.env.API_URL })

  const API_URL =
    process.env.API_URL === undefined
      ? 'https://incident-reporting-api.now.sh'
      : process.env.API_URL

  const socket = io(API_URL, {
    reconnect: true,
    forceNew: true,
    transports: ['websocket'],
    query: {
      token: localStorage.getItem('auth._token.local')
        ? localStorage.getItem('auth._token.local').replace('Bearer ', '')
        : ''
    }
  })

  socket.on('connect', () => {
    if (process.env.NODE_ENV === 'development') console.log('socket connected')
  })

  socket.on('error', err => {
    socket.disconnect()
  })

  ctx.$socket = socket
  inject('socket', socket)
}
