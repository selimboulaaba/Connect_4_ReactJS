import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
  const user = useSelector(state => state.user);


  return (
    <div className='grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl p-20'>
      <Link to={user.signedIn ? "/online" : "/signin"}><button className='w-full'>Play an Online Game</button></Link>
      <Link to="/local"><button className='w-full'>Play a Local Game</button></Link>
    </div>
  )
}

export default Home