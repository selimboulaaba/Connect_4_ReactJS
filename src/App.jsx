import React, { useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import LocalGame from './pages/LocalGame'
import Navbar from './components/NavBar'
import Home from './pages/Home'
import Signup from './pages/Signup'
import SignIn from './pages/SignIn'
import OnlineGameBoard from './pages/OnlineGameBoard'
import OnlineMenu from './pages/OnlineMenu'
import Friends from './pages/Friends'
import NotFound from './pages/NotFound'
import Profile from './pages/Profile'
import AuthGuard from './components/AuthGuard'
import ScrollToTop from './components/ScrollToTop'
import GuestGuard from './components/GuestGuard'
import Socket from './components/Socket'
import { Bounce, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import LeaderBoard from './pages/LeaderBoard'

function App() {
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
          <Route path='/leaderboard' element={<LeaderBoard />} />
        </Route>

        <Route element={<GuestGuard />}>
          <Route path='/signup' element={<Signup />} />
          <Route path='/signin' element={<SignIn />} />
        </Route>

        <Route path='/*' element={<NotFound />} />

      </Routes>
      <Socket />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </BrowserRouter>
  )
}

export default App
