import React, { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import LocalGame from './pages/LocalGame'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import OnlineGameBoard from './pages/OnlineGameBoard'
import OnlineMenu from './pages/OnlineMenu'
import { useDispatch, useSelector } from 'react-redux'
import { getUser } from './services/user.service'
import { setUser, startLoading } from './store/actions/userActions'
import { io } from 'socket.io-client';
import { nextGame, setGame } from './store/actions/gameActions'
import Friends from './pages/Friends'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import AuthGuard from './components/AuthGuard'
import ScrollToTop from './components/ScrollToTop'
import GuestGuard from './components/GuestGuard'

function App() {

  const username = useSelector(state => state.user.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(startLoading())
      getUser()
        .then(response => {
          dispatch(setUser(response.data.user));
        })
        .catch(error => {
        });
    }
  }, [username]);

  const socket = io(import.meta.env.VITE_API_URL)
  useEffect(() => {
    socket.on('connect', () => {
      if (username) {
        socket.emit('register', username);
      }
    });

    socket.on('newMove', (data) => {
      dispatch(setGame(data.newGame))
      if (data.next)
        dispatch(nextGame())
    });

    socket.on('gameJoined', (data) => {
      dispatch(setGame(data.newGame));
    });

    socket.on('inviteFriend', (data) => {
      console.log(data.newGame);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />
      <Routes>

        <Route path='/' element={<Home />} />
        <Route path='/local' element={<LocalGame />} />

        <Route element={<AuthGuard />}>
          <Route path='/online' >
            <Route path='' element={<OnlineMenu />} />
            <Route path=':id' element={<OnlineGameBoard />} />
          </Route>
          <Route path='/profile' element={<Profile />} />
          <Route path='/friends' element={<Friends />} />
        </Route>

        <Route element={<GuestGuard />}>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<SignIn />} />
        </Route>

        <Route path='/*' element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
