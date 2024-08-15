import React, { useState } from 'react'
import { signin } from '../services/user.service'
import { Link, useNavigate } from 'react-router-dom'
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

    const submit = (e) => {
        e.preventDefault();
        setAlert(null)
        if (user.username === "" || !!user.password === "") {
            setAlert("Insert Credentials.")
        } else {
            setLoading(true)
            signin(user)
                .then(response => {
                    dispatch(signIn(response.data))
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
            <div className="grid gap-6 mb-6 mt-12">
                <h1 className='font-bold text-[#646cff] mb-10'>Sign In</h1>
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
                        : <button onClick={submit}>Sign In</button>
                }
                <Link to="/signup">Create a New Account</Link>
            </div>
        </form>
    )
}

export default SignIn