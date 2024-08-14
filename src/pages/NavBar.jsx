import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../store/actions/userActions';

function Navbar() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    return (
        <nav className="sticky top-0 z-10 space-x-2">
            <Link to="/"><button>Home</button></Link>
            <Link to="/local"><button>Play a Local Game</button></Link>
            {user.signedIn
                ? <>
                    <button>{user.user.username}</button>
                    <button onClick={() => dispatch(signOut())}>Sign Out</button>
                </>
                : <Link to="/signin"><button>Login</button></Link>}
        </nav>
    )
}

export default Navbar