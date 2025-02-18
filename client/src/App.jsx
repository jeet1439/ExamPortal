import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignupPage from './pages/SignupPage/SignupPage'
import LoginPage from './pages/LoginPage/LoginPage'

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
