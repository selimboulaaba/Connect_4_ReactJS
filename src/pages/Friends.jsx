import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { addFriend, getUserByUsername } from '../services/user.service';
import { setUser } from '../store/actions/userActions';

function Friends() {

  const user = useSelector(state => state.user.user);
  const dispatch = useDispatch();

  const [friendId, setFriendId] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")
  const [users, setUsers] = useState([])

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

  useEffect(() => {
    getUserByUsername(friendId)
      .then(response => {
        const data = response.data.users
        setUsers(data ? data.filter(u => canInvite(u)) : [])
      })
  }, [friendId])

  const inviteFriend = (newFriend) => {
    addFriend(newFriend)
      .then(response => {
        dispatch(setUser(response.data.user))
        setUsers(users.filter(user => user._id !== newFriend))
      })
  }

  const inviteToGame = () => {

  }

  return (
    <div className="grid gap-6 mb-6 mt-16 border-[#646cff] border-[1px] rounded-xl p-20">
      {alert && <Alert message={alert} />}
      <form>
        <div className='grid'>
          <input
            type="text"
            value={friendId}
            onChange={(event) => setFriendId(event.target.value)}
            className="col-span-5 text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add Friend with Username"
          />
        </div>
      </form>
      {users?.map(user => (
        <div className="grid grid-cols-7 gap-3" key={user._id}>
          <input
            type="text"
            value={user.username}
            className="col-span-5 text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            disabled
          />
          <Link onClick={(event) => event.preventDefault()} className='col-span-2'>
            <button onClick={() => inviteFriend(user._id)} type='submit' className="w-full">Add Friend</button>
          </Link>
        </div>
      ))}
      <div className='border-[1px] rounded-xl border-[#646cff]'></div>
      {user.friends?.map(friend => (
        <div key={friend._id}>
          {loading
            ? <Loading />
            : <Link onClick={(event) => event.preventDefault()}><button onClick={inviteToGame} className="w-full">Invite {friend.username}</button></Link>
          }
        </div>
      ))
      }
    </div>
  )
}

export default Friends