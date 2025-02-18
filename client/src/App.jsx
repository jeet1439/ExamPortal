import React from 'react'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { BrowserRouter,Routes,Route } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    </BrowserRouter>
  )
}
