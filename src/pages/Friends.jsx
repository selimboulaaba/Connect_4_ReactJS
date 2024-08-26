import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getUserByUsername, handleFriend } from '../services/user.service';
import { setUser } from '../store/actions/userActions';

function Friends() {

  const { user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [friendId, setFriendId] = useState("")
  const [friendsLoading, setFriendsLoading] = useState(false)
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

  const searchFriends = (event) => {
    setFriendsLoading(true)
    setFriendId(event.target.value)
    getUserByUsername(event.target.value)
      .then(response => {
        const data = response.data.users
        setUsers(data ? data.filter(u => canInvite(u)) : [])
      })
      .finally(() => {
        setFriendsLoading(false)
      })
  }

  const handleFriends = (friend) => {
    handleFriend(friend)
      .then(response => {
        dispatch(setUser(response.data.user))
        setUsers(users.filter(user => user._id !== friend))
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
            onChange={searchFriends}
            className="col-span-5 text-center border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add Friend with Username"
          />
        </div>
      </form>
      {friendsLoading
        ? <Loading />
        : users?.map(user => (
          <div className="grid grid-cols-7 gap-3" key={user._id}>
            <input
              type="text"
              value={user.username}
              className="col-span-5 bg-transparent border border-[#646cff] text-center text-xl rounded-lg block w-full text-[#646cff] focus:ring-blue-500"
              disabled
            />
            <Link onClick={(event) => event.preventDefault()} className='col-span-2'>
              <button onClick={() => handleFriends(user._id)} type='submit' className="w-full">Add Friend</button>
            </Link>
          </div>
        ))}
      <div className='border-[1px] rounded-xl border-[#646cff]'></div>
      {loading
        ? <Loading />
        : user.friends?.map(friend => (
          <div key={friend._id}>
            <div className='grid grid-cols-7 gap-3'>
              <Link className='col-span-5' onClick={(event) => event.preventDefault()}>
                <button onClick={() => inviteToGame(friend._id)} className="w-full">Invite {friend.username}</button>
              </Link>
              <Link className='col-span-2' onClick={(event) => event.preventDefault()}>
                <button onClick={() => handleFriends(friend._id)}>Remove Friend</button>
              </Link>
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default Friends