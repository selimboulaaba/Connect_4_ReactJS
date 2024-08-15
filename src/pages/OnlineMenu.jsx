import React, { useState } from 'react'
import { createGame, joinGame } from '../services/game.service'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import Alert from '../components/Alert';

function OnlineMenu() {

    const user = useSelector(state => state.user);
    const [id, setId] = useState("")
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(null)

    const create = () => {
        setAlert(null)
        setLoading(true)
        createGame(user.user._id)
            .then(response => {
                navigate("/online/" + response.data.game._id)
            })
            .catch(error => {
                setAlert(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const join = () => {
        setAlert(null)
        if (id) {
            setLoading(true)
            joinGame(id)
                .then(response => {
                    navigate("/online/" + response.data.game._id)
                })
                .catch(error => {
                    setAlert(error.response.data.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            setAlert("Insert Game Id.")
        }
    }
    return (
        <>
            <div className="grid gap-6 mb-6 mt-32">
                {alert && <Alert message={alert} />}
                <div>
                    {loading
                        ? <Loading />
                        : <button onClick={create} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            Create a New Game
                        </button>
                    }
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
                    {loading
                        ? <Loading />
                        : <button onClick={join} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            Join a Game
                        </button>
                    }
                </div>
            </div>

        </>
    )
}

export default OnlineMenu