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
import { useDispatch } from 'react-redux'
import { getUser } from './services/user.service'
import { setUser } from './store/actions/userActions'
import OldGames from './pages/OldGames'

function App() {

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

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/online' >
          <Route path='' element={<OnlineMenu />} />
          <Route path=':id' element={<OnlineGameBoard />} />
        </Route>
        <Route path='/profile' element={<OldGames />} />
        <Route path='/local' element={<LocalGame />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/signin' element={<SignIn />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
