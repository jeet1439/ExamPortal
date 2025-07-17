import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';
import FullScreenLoader from '../components/Loader/FullScreenLoader';

// 🔄 Admin background video
import heroVideo from '../components/video/heroVideo.mp4';

export default function AdminLogin() {
  const [formData, setFormdata] = useState({});
  const [successMsg, setSuccessMsg] = useState('');

  const { loading, error: errorMessage } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormdata({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      return dispatch(signInFaliure('Please fill all the fields'));
    }

    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMsg('Admin Login successful!');
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate('/dashboard');
        }, 2000);
      } else {
        dispatch(signInFaliure(data.message));
        setSuccessMsg('');
      }
    } catch (error) {
      dispatch(signInFaliure(error.message));
      setSuccessMsg('');
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      {/* 🌐 Full-screen Background Video */}
      <div className="relative min-h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src={heroVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {/* 🕶️ Dark overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-70 backdrop-blur-sm z-10" />

        {/* 🔐 Login Form */}
        <div className="relative z-20 flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-md shadow-2xl rounded-xl border border-white/20">
            <h1 className="text-3xl font-bold text-center text-white mb-8">
              Admin Login
            </h1>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 rounded-md bg-white/80 text-black border border-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 rounded-md bg-white/80 text-black border border-gray-300 focus:ring-2 focus:ring-green-300"
                  placeholder="********"
                  required
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                Sign In
              </button>
            </form>

            {/* Success or Error messages */}
            {successMsg && (
              <div className="mt-4 text-green-400 text-center font-medium">
                {successMsg}
              </div>
            )}
            {errorMessage && (
              <div className="mt-4 text-red-400 text-center font-medium">
                {errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
