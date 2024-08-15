import React, { useState } from 'react'

function OnlineMenu() {

    const [id, setId] = useState("")

    const createGame = () => {

    }

    const joinGame = () => {

    }
    return (
        <>
            <div className="grid gap-6 mb-6 mt-32">
                <div>
                    <button onClick={createGame} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        Create a New Game
                    </button>
                </div>
                <div className='font-bold grid grid-cols-9 items-center'>
                    <div className='border-t-[1px] col-span-4'></div>
                    <div className='text-3xl mb-[5px]'>OR</div>
                    <div className='border-t-[1px] col-span-4'></div>
                </div>
                <div>
                    <input
                        type="text"
                        value={id}
                        onChange={(event) => setId(event.target.value)}
                        className="text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Insert Game Id Here *"
                    />
                </div>
                <div>
                    <button onClick={joinGame} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                        Join a Game
                    </button>
                </div>
            </div>

        </>
    )
}

export default OnlineMenu