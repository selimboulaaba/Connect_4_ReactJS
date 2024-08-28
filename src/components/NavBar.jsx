import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../store/actions/userActions';
import { io } from 'socket.io-client';
import { FaUserFriends } from "react-icons/fa";
import Loading from './Loading';

function Navbar() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    const socket = io(import.meta.env.VITE_API_URL)
    const handleDisconnect = () => {
        if (socket) {
            socket.disconnect();
        }
    }

    return (
        <nav className="flex top-0 z-10 justify-center w-full mt-[2rem]">
            <div className="flex space-x-2  justify-center">
                <Link to="/"><button>Home</button></Link>
                {user.loading
                    ? <button disabled><Loading className="content-center" w="6" h="6"/></button>
                    : user.signedIn
                        ? <>
                            <Link to="/profile"><button className='text-nowrap'>{user.user.username}</button></Link>
                            <Link to="/friends"><button><FaUserFriends className='h-6 w-6' /></button></Link>
                            <Link to="/signin"><button onClick={() => { dispatch(signOut()); handleDisconnect() }} className='text-nowrap'>Sign Out</button></Link>
                        </>
                        : <Link to="/signin"><button>Sign In</button></Link>
                }
            </div>
        </nav>
    )
}

export default Navbar