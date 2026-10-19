import { createContext, useContext, useEffect, useRef } from 'react'

export const SocketContext = createContext({ socket: null, connected: false })

export const useSocket = () => useContext(SocketContext)

/** Subscribes to a socket event for the component's lifetime; the latest handler is always used. */
export function useSocketEvent(event, handler) {
  const { socket } = useSocket()
  const ref = useRef(handler)
  ref.current = handler
  useEffect(() => {
    if (!socket) return
    const fn = (...args) => ref.current(...args)
    socket.on(event, fn)
    return () => socket.off(event, fn)
  }, [socket, event])
}
