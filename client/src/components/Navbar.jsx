import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signoutSuccess } from '../redux/user/userSlice.js';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/signout', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) console.log(data.message);
      else dispatch(signoutSuccess());
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white/80 via-blue-50 to-white/80 backdrop-blur-md shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text"
          >
            ExamPortal
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {currentUser && (
              <Link
                to={currentUser.isAdmin ? '/dashboard' : '/student-dashboard'}
                className="nav-link"
              >
                Dashboard
              </Link>
            )}

            <Link to="/student-login" className="nav-link">
              Results
            </Link>

            {!currentUser ? (
              <>
                <Link to="/student-login" className="nav-link">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 transition"
                >
                  Logout
                </button>
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold ${
                    currentUser.isAdmin ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition"
            >
              {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/90 backdrop-blur-md px-6 pt-4 pb-6 shadow-lg space-y-3">
          <Link to="/" className="mobile-link" onClick={toggleMenu}>
            Home
          </Link>
          {currentUser && (
            <Link
              to={currentUser.isAdmin ? '/dashboard' : '/student-dashboard'}
              className="mobile-link"
              onClick={toggleMenu}
            >
              Dashboard
            </Link>
          )}
          <Link to="/student-login" className="mobile-link" onClick={toggleMenu}>
            Results
          </Link>

          {!currentUser ? (
            <>
              <Link to="/student-login" className="mobile-link" onClick={toggleMenu}>
                Login
              </Link>
              <Link
                to="/register"
                className="block bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
                className="mobile-link text-red-600 hover:text-red-700"
              >
                Logout
              </button>
              <div className="flex items-center space-x-3 mt-3">
                <div
                  className={`w-10 h-10 rounded-full text-white flex items-center justify-center font-semibold ${
                    currentUser.isAdmin ? 'bg-green-600' : 'bg-blue-600'
                  }`}
                >
                  {currentUser.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-800 font-medium">
                  {currentUser.username}
                </span>
              </div>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
