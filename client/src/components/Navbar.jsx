import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice.js';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ExamPortal
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            {currentUser ? (
              currentUser.isAdmin ? (
                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  dashboard
                </Link>
              ) : (
                <Link to="/student-dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                  dashboard
                </Link>
              )
            ) : (
              ''
            )}

            <Link to="/results" className="text-gray-700 hover:text-blue-600 font-medium">
              Results
            </Link>
            {!currentUser ? (
              <>
                <Link to="/student-login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-10">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Logout
                </button>
                {/* Profile Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-full ${currentUser.isAdmin ? 'bg-green-600' : 'bg-blue-600'}`}>
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block text-gray-700 hover:text-blue-600 font-medium">
              Home
            </Link>
            <Link to="/exams" className="block text-gray-700 hover:text-blue-600 font-medium">
              Exams
            </Link>
            <Link to="/results" className="block text-gray-700 hover:text-blue-600 font-medium">
              Results
            </Link>
            {!currentUser ? (
              <>
                <Link to="/login" className="block text-gray-700 hover:text-blue-600 font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <button
                  onClick={handleLogout}
                  className="block text-red-600 hover:text-red-700 font-medium w-full text-left"
                >
                  Logout
                </button>
                <div className="flex items-center space-x-3 mt-3">
                  <div
                    className={`w-10 h-10 flex items-center justify-center text-white font-bold rounded-full ${currentUser.isAdmin ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {currentUser.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700 font-medium">{currentUser.username}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
