import React from 'react'

function Winner({ winner }) {
    return (
        <div className=''>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-center">{winner} is the Winner!</div>
        </div>
    )
}

export default Winner