import React, { useEffect, useState } from 'react'
import { getLeaderBoard } from '../services/user.service'
import Loading from '../components/Loading'

function LeaderBoard() {
    const [users, setUsers] = useState([])

    useEffect(() => {
        getLeaderBoard()
            .then(response => {
                setUsers(response.data.users)
            })
    }, [])

    return (
        <>
            <div className="grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-20">
                <h1 className='font-bold text-[#646cff] mb-10 underline text-nowrap text-4xl sm:text-6xl'>LeaderBoard</h1>
                {users.length === 0
                    ? <Loading w="6" h="6" />
                    : users.map((user, index) => (
                        <div key={index} className='grid grid-cols-12 px-3 sm:px-6 items-center'>
                            <h3
                                className={`mb-2 col-span-2 text-4xl font-bold text-center ${index === 0 ? "text-[#FFD700]" :
                                        index === 1 ? "text-[#C0C0C0]" :
                                            index === 2 ? "text-[#CD7F32]" :
                                                "text-[#646cff]"
                                    }`}>{index + 1}</h3>
                            <div className='col-span-10 sm:col-span-10 bg-[#646cff] rounded-full flex items-center justify-between sm:px-4 py-4 sm:mr-5'>
                                <h2 className='text-left ml-5 sm:ml-24 font-bold'>{user.username} <div className='inline font-light'>(Level {user.lvl})</div></h2>
                                <h2 className='text-right mr-5 sm:mr-24 font-bold'>{user.xp} xp</h2>
                            </div>
                        </div>
                    ))
                }
            </div >
        </>
    )
}

export default LeaderBoard