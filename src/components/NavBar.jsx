import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../store/actions/userActions';
import { io } from 'socket.io-client';

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
        <nav className="flex sticky top-0 z-10 justify-center w-full">
            <div className="flex space-x-2 w-[50vw] justify-center">
                <Link to="/"><button>Home</button></Link>
                {user.signedIn
                    ? <>
                        <Link to="/friends"><button>{user.user.username}</button></Link>
                        <Link to="/"><button onClick={() => { dispatch(signOut()); handleDisconnect() }}>Sign Out</button></Link>
                    </>
                    : <Link to="/signin"><button>Sign In</button></Link>
                }
            </div>
        </nav>
    )
}

export default Navbar