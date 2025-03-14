import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx';
import Hero from './pages/Hero.jsx';
import Rejister from './pages/Rejister.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/rejister' element={<Rejister/>}/>
      <Route path='/student-login' element={<StudentLogin/>}/>
    </Routes>
    </BrowserRouter>
  )
}
