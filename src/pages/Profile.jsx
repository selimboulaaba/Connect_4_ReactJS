import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading';
import Alert from '../components/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../services/user.service'
import { signIn, startLoading, stopLoading } from '../store/actions/userActions';
import { buildStyles, CircularProgressbar, CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getHistory } from '../services/game.service';
import UserAvatar from '../components/UserAvatar';

const AVATAR_IDS = Array.from({ length: 12 }, (_, i) => `avatar_${i + 1}`)

function Profile() {
  const connectedUser = useSelector(state => state.user);
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmedPassword: ""
  })
  const [alert, setAlert] = useState(null)
  const [history, setHistory] = useState([])
  const dispatch = useDispatch();

  useEffect(() => {
    getHistory().then(res => setHistory(res.data.history)).catch(() => {})
  }, [])

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

  const pickAvatar = (avatar) => {
    setAlert(null)
    dispatch(startLoading())
    updateProfile(connectedUser.user._id, {
      username: connectedUser.user.username,
      password: '',
      confirmedPassword: '',
      avatar,
    })
      .then((response) => {
        dispatch(signIn(response.data))
      })
      .catch((error) => {
        setAlert(error.response?.data?.message || 'Update failed')
      })
      .finally(() => dispatch(stopLoading()))
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

      {/* Win / Loss / Draw stats */}
      {connectedUser.signedIn && (
        <div className="grid gap-6 mb-6 mt-6 border-[#646cff] border-[1px] rounded-xl py-10 px-6">
          <h2 className='font-bold text-[#646cff] text-2xl'>Stats</h2>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-4 text-center max-w-lg mx-auto w-full'>
            <div>
              <div className='text-3xl font-bold text-green-400'>{connectedUser.user.stats?.wins ?? 0}</div>
              <div className='text-sm text-gray-400'>Wins</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-red-400'>{connectedUser.user.stats?.losses ?? 0}</div>
              <div className='text-sm text-gray-400'>Losses</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-yellow-400'>{connectedUser.user.stats?.draws ?? 0}</div>
              <div className='text-sm text-gray-400'>Draws</div>
            </div>
            <div>
              <div className='text-3xl font-bold text-[#646cff]'>
                {(() => {
                  const w = connectedUser.user.stats?.wins ?? 0
                  const l = connectedUser.user.stats?.losses ?? 0
                  const d = connectedUser.user.stats?.draws ?? 0
                  const total = w + l + d
                  return total > 0 ? Math.round((w / total) * 100) + '%' : '—'
                })()}
              </div>
              <div className='text-sm text-gray-400'>Win Rate</div>
            </div>
          </div>
        </div>
      )}

      {connectedUser.signedIn && (
        <div className="grid gap-4 mb-6 mt-6 border-[#646cff] border-[1px] rounded-xl py-10 px-6">
          <h2 className='font-bold text-[#646cff] text-xl'>Avatar</h2>
          <div className='grid grid-cols-6 gap-2 sm:gap-3 max-w-md mx-auto'>
            {AVATAR_IDS.map((id) => (
              <button
                key={id}
                type='button'
                onClick={() => pickAvatar(id)}
                className={`flex aspect-square w-full max-w-[3.25rem] mx-auto items-center justify-center overflow-hidden rounded-full border-2 p-0.5 transition-colors ${
                  (connectedUser.user.avatar || 'avatar_1') === id
                    ? 'border-[#646cff] ring-2 ring-[#646cff]/40 ring-offset-2 ring-offset-[#1a1a1a]'
                    : 'border-transparent hover:border-[#646cff]/50'
                }`}
                aria-label={`Select ${id}`}
              >
                <UserAvatar avatarId={id} sizePx={42} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Game history */}
      {history.length > 0 && (
        <div className="grid gap-3 mb-6 mt-6 border-[#646cff] border-[1px] rounded-xl py-10 px-6">
          <h2 className='font-bold text-[#646cff] text-2xl mb-2'>Recent Rounds</h2>
          {history.map((entry, i) => {
            const won = entry.winner.username === connectedUser.user.username
            const opponent = won ? entry.loser.username : entry.winner.username
            const date = new Date(entry.createdAt).toLocaleDateString()
            return (
              <div key={i} className='flex justify-between items-center text-sm border-b border-gray-700 pb-2'>
                <span className={`font-bold ${won ? 'text-green-400' : 'text-red-400'}`}>{won ? 'WIN' : 'LOSS'}</span>
                <span className='text-gray-300'>vs <span className='text-white font-semibold'>{opponent}</span></span>
                <span className='text-gray-500'>{date}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Achievements */}
      {connectedUser.signedIn && (
        <div className="grid gap-4 mb-6 mt-6 border-[#646cff] border-[1px] rounded-xl py-10 px-6">
          <h2 className='font-bold text-[#646cff] text-2xl mb-2'>Achievements</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {[
              { id: 'first_win', label: 'First Blood', desc: 'Win your first game', icon: '🏆' },
              { id: 'ten_wins', label: 'Veteran', desc: 'Win 10 games', icon: '⚔️' },
              { id: 'fifty_wins', label: 'Champion', desc: 'Win 50 games', icon: '👑' },
              { id: 'giant_slayer', label: 'Giant Slayer', desc: 'Beat a player 5+ levels above you', icon: '🐉' },
              { id: 'shutout', label: 'Shutout', desc: 'Win without opponent scoring', icon: '🛡️' },
              { id: 'speedrun', label: 'Speedrun', desc: 'Win in 15 moves or less', icon: '⚡' },
            ].map(achievement => {
              const unlocked = connectedUser.user.achievements?.includes(achievement.id)
              return (
                <div key={achievement.id} className={`p-4 rounded-lg text-center transition-all ${unlocked ? 'bg-yellow-900 border-2 border-yellow-400' : 'bg-gray-800 border-2 border-gray-700 opacity-50'}`}>
                  <div className='text-4xl mb-2'>{achievement.icon}</div>
                  <div className='font-bold text-sm text-white'>{achievement.label}</div>
                  <div className='text-xs text-gray-400 mt-1'>{achievement.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

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