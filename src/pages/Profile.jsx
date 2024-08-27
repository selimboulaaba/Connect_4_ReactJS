import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../services/user.service'
import { startLoading, stopLoading } from '../store/actions/userActions';

function Profile() {
  const connectedUser = useSelector(state => state.user);
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmedPassword: ""
  })
  const [alert, setAlert] = useState(null)
  const dispatch = useDispatch();

  useEffect(() => {
    setUser({
      ...user,
      username: connectedUser.user.username
    })
  }, [connectedUser.user]
  )
  const handleChange = (input, event) => {
    setUser({
      ...user,
      [input]: event.target.value
    })
  }

  const submit = (e) => {
    e.preventDefault();
    setAlert(null)
    if (user.username === "") {
      setAlert("Insert Username.")
    } else if (user.password !== user.confirmedPassword) {
      setAlert("Passwords Not Matching.")
    } else {
      dispatch(startLoading())
      updateProfile(connectedUser.user._id, user)
        .then(response => {
          dispatch(setUser(response.data.user))
        })
        .catch(error => {
          setAlert(error.response.data.message)
          dispatch(stopLoading())
        })
    }
  }
  return (
    <form>
      <div className="grid gap-6 mb-6 mt-28 border-[#646cff] border-[1px] rounded-xl p-20">

        <h1 className='font-bold text-[#646cff] mb-10'>
          Update -
          {connectedUser.loading
            ? <Loading className="inline-block" />
            : connectedUser.user.username
          }
          -</h1>
        {alert && <Alert message={alert} />}
        <div>
          <label htmlFor="username" className="block mb-2 text-sm font-medium text-white">Username</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(event) => handleChange("username", event)}
            className="text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Username *"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
          <input
            type="password"
            id="password"
            value={user.password}
            onChange={(event) => handleChange("password", event)}
            className="text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Password *"
          />
        </div>
        <div>
          <label htmlFor="confirmedPassword" className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
          <input
            type="password"
            id="confirmedPassword"
            value={user.confirmedPassword}
            onChange={(event) => handleChange("confirmedPassword", event)}
            className="text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm Password *"
          />
        </div>
        {
          connectedUser.loading
            ? <Loading />
            : <button onClick={submit}>Update</button>
        }
      </div>
    </form>
  )
}

export default Profile