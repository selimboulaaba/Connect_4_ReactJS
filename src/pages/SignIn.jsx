import React, { useState } from 'react'
import { signin } from '../services/user.service'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { useDispatch } from 'react-redux'
import { signIn } from '../store/actions/userActions'

function SignIn() {
    const [user, setUser] = useState({
        username: "",
        password: ""
    })
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [alert, setAlert] = useState(null)
    const dispatch = useDispatch();

    const handleChange = (input, event) => {
        setUser({
            ...user,
            [input]: event.target.value
        })
    }

    const submit = (event) => {
        setAlert(null)
        setLoading(true)
        signin(user)
            .then(response => {
                dispatch(signIn(response.data.data))
                navigate("/")
            })
            .catch(error => {
                setAlert(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            {loading
                ? <Loading />
                : <div className="grid gap-6 mb-6 mt-32">
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
                            required
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
                            required
                        />
                    </div>
                    <button onClick={submit}>Signin</button>
                    <a href="/signup">Create a New Account</a>
                </div>
            }
        </>
    )
}

export default SignIn