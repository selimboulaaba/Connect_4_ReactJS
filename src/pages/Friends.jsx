import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getUserByUsername, handleFriend, getOnlineStatus, getUser, dismissPendingGameInvite } from '../services/user.service';
import { setUser } from '../store/actions/userActions';
import { MdDelete } from "react-icons/md";
import { inviteFriend, getGame } from '../services/game.service';
import { toast } from 'react-toastify';
import { getSocket } from '../contexts/socketInstance';

function Friends() {

  const { user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [friendId, setFriendId] = useState("")
  const [friendsLoading, setFriendsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [friendLoading, setloading] = useState(null)
  const [inviteLoading, setInviteLoading] = useState(null)
  const [onlineStatus, setOnlineStatus] = useState({})

  useEffect(() => {
    getUser()
      .then((res) => dispatch(setUser(res.data.user)))
      .catch(() => {})
  }, [dispatch])

  useEffect(() => {
    const fetchStatus = () => {
      getOnlineStatus().then(res => setOnlineStatus(res.data.onlineFriends || {})).catch(() => {})
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  const canInvite = (u) => {
    if (u._id === user._id) {
      return false;
    }
    for (let friend of user.friends) {
      if (u._id === friend._id) {
        return false;
      }
    }
    return true;
  }

  const searchFriends = (event) => {
    setFriendId(event.target.value)
    if (event.target.value === "") {
      setUsers([])
    } else {
      setFriendsLoading(true)
      getUserByUsername(event.target.value)
        .then(response => {
          const data = response.data.users
          setUsers(data ? data.filter(u => canInvite(u)) : [])
        })
        .finally(() => {
          setFriendsLoading(false)
        })
    }
  }

  const handleFriends = (friend) => {
    setloading(friend)
    handleFriend(friend)
      .then(response => {
        dispatch(setUser(response.data.user))
        setUsers(users.filter(user => user._id !== friend))
      })
      .finally(() => {
        setloading(null)
      })
  }

  const inviteToGame = (friendId) => {
    setInviteLoading(friendId)
    inviteFriend(user._id, friendId)
      .then(response => {
        toast.success('The invite has been sent.');
      })
      .finally(() => {
        setInviteLoading(null)
      })
  }

  const pendingInvites = user.pendingGameInvites || []

  const openInviteGame = async (inv) => {
    const gameId = (inv.game && inv.game._id) || inv.game
    if (!gameId) return
    try {
      const { data } = await getGame(gameId)
      const socket = getSocket()
      if (socket && data.game) socket.emit('acceptInvite', { newGame: data.game })
    } catch {
      toast.error('That game no longer exists. Removing invite.')
      try {
        const res = await dismissPendingGameInvite(gameId)
        dispatch(setUser(res.data.user))
      } catch { /* ignore */ }
      return
    }
    navigate('/online/' + gameId)
    getUser().then((res) => dispatch(setUser(res.data.user))).catch(() => {})
  }

  const removeInvite = async (gameId) => {
    try {
      const res = await dismissPendingGameInvite(gameId)
      dispatch(setUser(res.data.user))
    } catch (e) {
      toast.error(e.response?.data?.message || 'Could not dismiss')
    }
  }

  return (
    <>
      <Link to="/leaderboard">
        <button className="mt-16 mb-2 text-xl w-[90%] md:w-[70%] lg:w-[50%] m-auto">LeaderBoard</button>
      </Link>

      <div className="grid gap-6 mb-6 border-[#646cff] border-[1px] rounded-xl py-20">
        <h1 className='font-bold text-[#646cff] mb-10 underline text-nowrap text-4xl sm:text-6xl'>Friends</h1>

        {pendingInvites.length > 0 && (
          <div className='mx-5 md:mx-12 mb-8 border border-[#646cff]/50 rounded-xl p-4 bg-[#646cff]/5'>
            <h2 className='text-[#646cff] font-bold text-lg mb-3'>Game invites</h2>
            <ul className='space-y-2'>
              {pendingInvites.map((inv) => {
                const gid = (inv.game && inv.game._id) || inv.game
                return (
                  <li key={String(gid)} className='flex flex-wrap items-center justify-between gap-2 text-sm border-b border-gray-700 pb-2'>
                    <span>
                      <span className='text-gray-400'>From</span>{' '}
                      <span className='font-semibold text-white'>{inv.fromUsername}</span>
                    </span>
                    <span className='flex gap-2'>
                      <button type='button' onClick={() => openInviteGame(inv)}>Open game</button>
                      <button type='button' className='text-red-400' onClick={() => removeInvite(gid)}>Dismiss</button>
                    </span>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <form>
          <div className='grid'>
            <input
              type="text"
              value={friendId}
              onChange={searchFriends}
              className="w-[90%] md:w-[70%] lg:w-[50%] m-auto col-span-5 text-center border text-sm rounded-lg block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
              placeholder="Add Friend with Username"
              autoFocus
            />
          </div>
        </form>
        {friendsLoading
          ? <Loading w="6" h="6" />
          : (users.length === 0 && friendId != '')
            ? <p className='truncate mx-5'>There are no users for '{friendId}'</p>
            : users?.map(user => (
              <div className="grid grid-cols-7 gap-3 mx-5 md:mx-12" key={user._id}>
                <Link onClick={(event) => event.preventDefault()} className='col-span-7'>
                  {friendLoading === user._id
                    ? <button disabled className='w-full'><Loading className="mx-3" w="6" h="6" /></button>
                    : <button onClick={() => handleFriends(user._id)} type='submit' className="w-full text-nowrap">Add Friend: <p className='inline underline'>{user.username}</p> (Level {user.lvl})</button>
                  }
                </Link>
              </div>
            ))
        }
        <div className='border-[1px] rounded-xl border-[#646cff] mx-12'></div>
        {user.friends?.length === 0 && <p className='text-[#646cff] font-semibold'>Lonely ? Add some Friends.</p>}
        {loading
          ? <Loading w="6" h="6" />
          : user.friends?.map(friend => (
            <div key={friend._id}>
              <div className='flex gap-3 mx-5 md:mx-12'>
                <Link className='w-full' onClick={(event) => event.preventDefault()}>
                  {inviteLoading === friend._id
                    ? <button disabled className='w-full'><Loading className="mx-3" w="6" h="6" /></button>
                    : <button onClick={() => inviteToGame(friend._id)} className="w-full">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${onlineStatus?.[friend.username] ? 'bg-green-400' : 'bg-gray-500'}`} />
                        Invite: <span className='underline'>{friend.username}</span> (Level {friend.lvl})
                      </button>
                  }
                </Link>
                <Link className='' onClick={(event) => event.preventDefault()}>
                  {friendLoading === friend._id
                    ? <button className='w-full h-full py-2 px-4' disabled><Loading w="6" h="6" /></button>
                    : <button className='w-full h-full py-2 px-4' onClick={() => handleFriends(friend._id)}><MdDelete className='h-6 w-6' /></button>
                  }
                </Link>
              </div>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default Friends