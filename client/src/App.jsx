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
import StudentDashboard from './pages/StudentDashboard.jsx';
import ExamPage from './pages/ExamPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/register' element={<Rejister/>}/>
      <Route path='/student-login' element={<StudentLogin/>}/>
      <Route path='/admin-login' element={<AdminLogin/>}/>
      <Route element={<PrivateRoute/>}>
          <Route path='/student-dashboard' element={<StudentDashboard/>}/>
      </Route>
       <Route element={<AdminPrivate/>}>
       <Route path='/dashboard' element={<Dashboard />} />
       </Route> 
       <Route path='/newExam/:examId' element={<ExamPage />} />
    </Routes>
    </BrowserRouter>
  )
}
