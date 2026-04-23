import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Home() {
  const user = useSelector(state => state.user);


  return (
    <div className='grid gap-6 mb-6 mt-12 border-[#646cff] border-[1px] rounded-xl py-20'>
      <Link to={user.signedIn ? "/online" : "/signin"}><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Play an Online Game</button></Link>
      <Link to="/ai"><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Play vs CPU</button></Link>
      <Link to="/local"><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Play a Local Game</button></Link>
      {user.signedIn && (
        <>
          <Link to="/watch"><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Watch a Game</button></Link>
          <Link to="/daily"><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Daily Puzzle</button></Link>
          <Link to="/tournament"><button className='w-[90%] md:w-[70%] lg:w-[50%] m-auto '>Tournament (4 players)</button></Link>
        </>
      )}
    </div>
  )
}

export default Home