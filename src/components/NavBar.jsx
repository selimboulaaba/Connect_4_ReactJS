import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from '../store/actions/userActions';
import { FaUserFriends } from "react-icons/fa";
import Loading from './Loading';

function Navbar() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const pendingInvites = user.user?.pendingGameInvites?.length || 0;

    return (
        <nav className="flex top-0 z-10 justify-center w-full mt-[2rem]">
            <div className="flex space-x-2  justify-center">
                <Link to="/"><button>Home</button></Link>
                {user.loading
                    ? <button disabled><Loading className="content-center" w="6" h="6"/></button>
                    : user.signedIn
                        ? <>
                            <Link to="/profile"><button className='text-nowrap'>{user.user.username}</button></Link>
                            <Link to="/friends">
                                <button className='relative'>
                                    <FaUserFriends className='h-6 w-6' />
                                    {pendingInvites > 0 && (
                                        <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center'>
                                            {pendingInvites > 9 ? '9+' : pendingInvites}
                                        </span>
                                    )}
                                </button>
                            </Link>
                            <Link to="/signin"><button onClick={() => dispatch(signOut())} className='text-nowrap'>Sign Out</button></Link>
                        </>
                        : <Link to="/signin"><button>Sign In</button></Link>
                }
            </div>
        </nav>
    )
}

export default Navbar