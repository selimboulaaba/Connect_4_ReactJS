import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../services/user.service'
import { signIn, startLoading, stopLoading } from '../store/actions/userActions';
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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
          dispatch(signIn(response.data))
        })
        .catch(error => {
          setAlert(error.response.data.message)
          dispatch(stopLoading())
        })
    }
  }

  const calculateExperienceProgress = () => {
    if (connectedUser.user.lvl && connectedUser.user.xp) {
      let oldExp = 0;
      let maxExp = 100;
      if (connectedUser.user.lvl === 2) {
        oldExp = 100
        maxExp = 250
      } else if (connectedUser.user.lvl > 2) {
        oldExp = 250 * 2 ** (connectedUser.user.lvl - 3)
        maxExp = 250 * 2 ** (connectedUser.user.lvl - 2)
      }
      return ((connectedUser.user.xp - oldExp) / (maxExp - oldExp)) * 100
    }
  }

  return (
    <>
      <div className="grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-20">
        {connectedUser.signedIn
          ? <div className='w-full grid grid-cols-12'>
            <div className="star_container md:col-start-2 md:col-span-5 col-span-12">
              <div className="svg-icon">
                <div className='text-xl'>Level</div>
                <div className='text-8xl'>{connectedUser.user.lvl}</div>
              </div>
              <div className="container__star">

                <div className="star-eight"></div>
              </div>
            </div>
            <div className='mt-28 md:mt-0 mx-auto md:col-span-5 col-span-12'>
              <CircularProgressbarWithChildren
                value={calculateExperienceProgress()}
                styles={{
                  // Customize the root svg element
                  root: {
                    width: '200'
                  },
                  // Customize the path, i.e. the "completed progress"
                  path: {
                    // Path color
                    stroke: `#646cff`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'round',
                    // Customize transition animation
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                    // Rotate the path
                    transform: 'rotate(0.39turn)',
                    transformOrigin: 'center center',
                  },
                  // Customize the circle behind the path, i.e. the "total progress"
                  trail: {
                    stroke: '#FFF764',
                    strokeLinecap: 'butt',
                    transform: 'rotate(0.25turn)',
                    transformOrigin: 'center center',
                  },
                  text: {
                    fill: '#646cff',
                    fontSize: '16px',
                  },
                }}
              >
                <img style={{ width: 40, marginTop: -5 }} src="https://i.imgur.com/b9NyUGm.png" alt="doge" />
                <div style={{ fontSize: 28, marginTop: -5, color: '#646cff' }}>
                  <strong>{connectedUser.user.xp}</strong> xp
                </div>
              </CircularProgressbarWithChildren >
            </div>
          </div>
          : <Loading w="6" h="6" />
        }
      </div>

      <form>
        <div className="grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-20">

          <h1 className='font-bold text-[#646cff] mb-10 underline text-nowrap text-4xl sm:text-6xl'>Update Profile</h1>
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
          <div>
            <label htmlFor="confirmedPassword" className="block mb-2 text-sm font-medium text-white">Confirm Password</label>
            <input
              type="password"
              id="confirmedPassword"
              value={user.confirmedPassword}
              onChange={(event) => handleChange("confirmedPassword", event)}
              className="w-[90%] md:w-[70%] lg:w-[50%] m-auto text-center border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm Password *"
            />
          </div>
          {
            connectedUser.loading
              ? <Loading w="6" h="6" />
              : <button onClick={submit} className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Update</button>
          }
        </div>
      </form>
    </>
  )
}

export default Profile