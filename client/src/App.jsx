import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx';
import Hero from './pages/Hero.jsx';
import Rejister from './pages/Rejister.jsx';
import StudentLogin from './pages/StudentLogin.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import AdminPrivate from './components/AdminPrivate.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/rejister' element={<Rejister/>}/>
      <Route path='/student-login' element={<StudentLogin/>}/>
      <Route path='/admin-login' element={<AdminLogin/>}/>
      <Route element={<PrivateRoute/>}>
          {/* {all page which cant be accessed with login , client validation} */}
      </Route>
       <Route element={<AdminPrivate/>}>
       <Route path='/dashboard' element={<Dashboard />} />
       </Route> 
    </Routes>
    </BrowserRouter>
  )
}
