import React from 'react'

function Winner({ winner }) {
    return (
        <div className=''>
            <div className="text-nowrap p-10 rounded-3xl bg-[#00000080] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-bold text-center">
                {winner.split('\n').map((line, index) => (
                    <React.Fragment key={index}>
                        {line}
                        <br />
                    </React.Fragment>
                ))}
            </div>
        </div>
    )
}

export default Winner