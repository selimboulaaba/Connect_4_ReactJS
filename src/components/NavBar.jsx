import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../store/actions/userActions';

function Navbar() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();

    return (
        <nav className="flex sticky top-0 z-10 space-x-2">
            <Link to="/"><button>Home</button></Link>
            <Link to={user.signedIn ? "/online" : "/signin"}><button>Play an Online Game</button></Link>
            <Link to="/local"><button>Play a Local Game</button></Link>
            {user.signedIn
                ? <>
                    <div className='text-[#646cff] rounded-lg border border-transparent px-4 py-2 text-base font-medium bg-[#1a1a1a] transition-colors duration-200'>{user.user.username}</div>
                    <Link to="/"><button onClick={() => dispatch(signOut())}>Sign Out</button></Link>
                </>
                : <Link to="/signin"><button>Sign In</button></Link>
            }
        </nav>
    )
}

export default Navbar