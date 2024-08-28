import React, { useState } from 'react'
import Loading from '../components/Loading'
import { signup } from '../services/user.service'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert'

function Signup() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [alert, setAlert] = useState(null)

    const handleChange = (input, event) => {
        setUser({
            ...user,
            [input]: event.target.value
        })
    }

    const submit = () => {
        setAlert(null)
        if (user.username === "" || !!user.password === "") {
            setAlert("Insert Credentials.")
        } else {
            setLoading(true)
            signup(user)
                .then(response => {
                    navigate("/")
                })
                .catch(error => {
                    setAlert(error.response.data.message)
                })
                .finally(() => {
                    setLoading(false)
                })
        }

    }

    return (
        <form>
            <div className="grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-20">
            <h1 className='font-bold text-[#646cff] mb-10 underline'>Sign Up</h1>
                {alert && <Alert message={alert} />}
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(event) => handleChange("username", event)}
                        className="w-[90%] md:w-[70%] lg:w-[50%] m-auto text-center border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Username *"
                        autoFocus
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(event) => handleChange("password", event)}
                        className="w-[90%] md:w-[70%] lg:w-[50%] m-auto text-center border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Password *"
                    />
                </div>
                {
                    loading
                        ? <Loading  w="6" h="6"/>
                        : <button onClick={submit} className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Sign Up</button>
                }
                <Link to="/signin">Sign in with Existing Account.</Link>
            </div>

        </form>
    )
}

export default Signup