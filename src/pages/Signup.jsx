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
        <>
            <div className="grid gap-6 mb-6 mt-32">
                {alert && <Alert message={alert} />}
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={user.username}
                        onChange={(event) => handleChange("username", event)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Username *"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={user.password}
                        onChange={(event) => handleChange("password", event)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Password *"
                    />
                </div>
                {
                    loading
                        ? <Loading />
                        : <button onClick={submit}>Sign Up</button>
                }
                <Link to="/signin">Sign in with Existing Account.</Link>
            </div>

        </>
    )
}

export default Signup