import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { getUserByUsername, handleFriend } from '../services/user.service';
import { setUser } from '../store/actions/userActions';
import { MdDelete } from "react-icons/md";

function Friends() {

  const { user, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const [friendId, setFriendId] = useState("")
  const [friendsLoading, setFriendsLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [friendLoading, setloading] = useState(null)

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

  const inviteToGame = () => {

  }

  return (
    <div className="grid gap-6 mb-6 mt-16 border-[#646cff] border-[1px] rounded-xl py-20">
              <h1 className='font-bold text-[#646cff] mb-10 underline text-nowrap text-4xl sm:text-6xl'>Friends</h1>
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
        ? <Loading  w="6" h="6"/>
        : users?.map(user => (
          <div className="grid grid-cols-7 gap-3 mx-5 md:mx-12" key={user._id}>
            <Link onClick={(event) => event.preventDefault()} className='col-span-7'>
              {friendLoading === user._id
                ? <button disabled className='w-full'><Loading className="mx-3" /></button>
                : <button onClick={() => handleFriends(user._id)} type='submit' className="w-full text-nowrap">Add Friend: <p className='text-2xl inline'>{user.username}</p></button>
              }
            </Link>
          </div>
        ))}
      <div className='border-[1px] rounded-xl border-[#646cff] mx-12'></div>
      {user.friends?.length === 0 && <p className='text-[#646cff] font-semibold'>Lonely ? Add some Friends.</p>}
      {loading
        ? <Loading  w="6" h="6"/>
        : user.friends?.map(friend => (
          <div key={friend._id}>
            <div className='flex gap-3 mx-5 md:mx-12'>
              <Link className='w-full' onClick={(event) => event.preventDefault()}>
                <button onClick={() => inviteToGame(friend._id)} className="w-full">Invite {friend.username}</button>
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
  )
}

export default Friends