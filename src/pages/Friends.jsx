import React, { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import Alert from '../components/Alert'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';

function Friends() {

  const user = useSelector(state => state.user.user);

  const [friendId, setFriendId] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState("")

  const inviteFriend = () => {

  }

  const inviteToGame = () => {

  }

  return (
    <div className="grid gap-6 mb-6 mt-16 border-[#646cff] border-[1px] rounded-xl p-20">
      {alert && <Alert message={alert} />}
      <div className='grid grid-cols-7 gap-3'>
        <input
          type="text"
          value={friendId}
          onChange={(event) => setFriendId(event.target.value)}
          className="col-span-5 text-center bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Add Friend with Username"
        />
        <Link onClick={(event) => event.preventDefault()} className='col-span-2'>
          <button onClick={inviteFriend} className="w-full">Send Invite</button>
        </Link>
      </div>
      {user.friends?.map(friend => (
        <div>
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