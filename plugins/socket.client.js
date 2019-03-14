import io from 'socket.io-client'
import dotenv from 'dotenv'
dotenv.config()

export default function (ctx, inject) {
  const socket = io(
    process.env.API_PROXY ? process.env.API_PROXY_TARGET : process.env.API_URL,
    {
      reconnect: true,
      forceNew: true,
      transports: ['websocket'],
      query: {
        token: window.localStorage.getItem('auth._token.local')
          ? window.localStorage
            .getItem('auth._token.local')
            .replace('Bearer ', '')
          : ''
      }
    }
  )

  socket.on('connect', () => {
    if (process.env.NODE_ENV === 'development') console.log('socket connected')

    // socket.emit('join', { _id: ctx.store.state.auth.user._id })
  })

  socket.on('error', err => {
    console.log(err)
    socket.disconnect()
  })

  ctx.$socket = socket
  inject('socket', socket)
}
