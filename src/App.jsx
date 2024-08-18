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
import { setUser } from './store/actions/userActions'
import { io } from 'socket.io-client';
import { setGame } from './store/actions/gameActions'
import Friends from './pages/Friends'

function App() {

  const username = useSelector(state => state.user.user.username);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUser()
        .then(response => {
          dispatch(setUser(response.data.user));
        })
        .catch(error => {
        });
    }
  }, [dispatch]);

  const socket = io(import.meta.env.VITE_API_URL)
  useEffect(() => {
    socket.on('connect', () => {
      if (username) {
        socket.emit('register', username);
      }
    });

    socket.on('newMove', (data) => {
      dispatch(setGame(data.newGame))
    });

    socket.on('gameJoined', (data) => {
      dispatch(setGame(data.newGame));
    });

    socket.on('PlayerConnectedToGame', (data) => {
      console.log(data.user, data.availability);
    });

    return () => {
      socket.disconnect();
    };
  }, [username]);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/online' >
          <Route path='' element={<OnlineMenu />} />
          <Route path=':id' element={<OnlineGameBoard />} />
        </Route>
        <Route path='/friends' element={<Friends />} />
        <Route path='/local' element={<LocalGame />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
