import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { io } from 'socket.io-client'
import { API_URL } from './api'
import { SocketContext } from './socketContext'

/** One authenticated socket for the whole app, recreated when the session changes. */
export function SocketProvider({ children }) {
  const token = useSelector((s) => s.user.token)
  const [state, setState] = useState({ socket: null, connected: false })

  useEffect(() => {
    if (!token) {
      setState({ socket: null, connected: false })
      return
    }
    const socket = io(API_URL, { auth: { token }, reconnectionDelayMax: 5000 })
    const sync = () => setState({ socket, connected: socket.connected })
    socket.on('connect', sync)
    socket.on('disconnect', sync)
    setState({ socket, connected: socket.connected })
    return () => {
      socket.off('connect', sync)
      socket.off('disconnect', sync)
      socket.disconnect()
    }
  }, [token])

  return <SocketContext.Provider value={state}>{children}</SocketContext.Provider>
}
