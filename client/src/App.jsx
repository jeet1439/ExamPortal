import React from 'react'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignupPage from './pages/Signup/SignupPage'
import LoginPage from './pages/Login/LoginPage'

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/login' element={<LoginPage/>}/>
    </Routes>
    </BrowserRouter>
  )
}
