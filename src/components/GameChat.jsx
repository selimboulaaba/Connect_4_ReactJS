import React, { useEffect, useRef, useState } from 'react'
import { getSocket } from '../contexts/socketInstance'
import { boardOuter } from '../game/boardLayout'

const QUICK_MESSAGES = ['GG!', 'Nice move!', 'So lucky...', '🤔', '😎']

function GameChat({ username, opponentUsername }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const bottomRef = useRef(null)

    useEffect(() => {
        const socket = getSocket()
        if (!socket) return

        const handler = (msg) => {
            setMessages(prev => [...prev, msg])
        }
        socket.on('chatMessage', handler)
        return () => socket.off('chatMessage', handler)
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const emit = (message) => {
        const socket = getSocket()
        if (!socket || !message.trim()) return
        socket.emit('chatMessage', { username, opponentUsername, message: message.trim() })
    }

    const sendMessage = (e) => {
        e.preventDefault()
        emit(input)
        setInput('')
    }

    return (
        <div className={`border border-[#646cff] rounded-xl p-4 flex flex-col mt-6 ${boardOuter}`}>
            <div className='text-sm font-bold text-[#646cff] mb-2'>Chat</div>

            <div className='flex-1 overflow-y-auto space-y-1 text-sm mb-3 h-40'>
                {messages.length === 0 && (
                    <p className='text-gray-500 text-xs text-center mt-4'>Say something!</p>
                )}
                {messages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}>
                        <span className={`px-3 py-1 rounded-2xl text-sm max-w-[75%] break-words ${msg.username === username ? 'bg-[#646cff] text-white' : 'bg-gray-700 text-white'}`}>
                            {msg.message}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            <div className='flex gap-1 flex-wrap mb-2'>
                {QUICK_MESSAGES.map(m => (
                    <button key={m} className='text-xs px-2 py-1 border-[#646cff]' onClick={() => emit(m)}>
                        {m}
                    </button>
                ))}
            </div>

            <form onSubmit={sendMessage} className='flex gap-2'>
                <input
                    className='flex-1 rounded-lg bg-gray-700 border border-gray-600 px-3 py-1 text-sm text-white focus:border-[#646cff] outline-none'
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder='Type a message...'
                    maxLength={100}
                />
                <button type='submit' className='px-4 py-1 text-sm'>Send</button>
            </form>
        </div>
    )
}

export default GameChat
