import React from 'react'
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, Link } from "react-router-dom"
import { useEffect } from 'react';
import DashVerifyStudent from '../components/DashVerifyStudent.jsx';


export default function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);

  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab')
    if(tabFromUrl){
      setTab(tabFromUrl);
    }
  },[location.search])


  return (
    <div>
      Dashboard
      <p>name: {currentUser.username}</p>
      <p>Admin ? {currentUser.isAdmin ? "yes" : "no" }</p>
       
      <button className='bg-blue-600 p-3 rounded-sm'>
      {currentUser.isAdmin && (
                <Link to='/dashboard?tab=verifyStudent'>
                VerifyStudent
                </Link>)}
      </button>

      {tab === 'verifyStudent' && <DashVerifyStudent/>}
    </div>
  )
}
