import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';
import FullScreenLoader from '../components/Loader/FullScreenLoader';

// ✅ Import your local video file
import heroVideo from '../components/video/heroVideo.mp4';

export default function StudentLogin() {
  const [formData, setFormdata] = useState({});
  const [successmsg, setSuccessMsg] = useState('');

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
      const res = await fetch('/api/auth/signin-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Signin successful: ', data);
        setSuccessMsg('Login successful!');
        
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate('/student-dashboard');
        }, 3000);
      } else {
        console.error('Sign in failed', data.message);
        dispatch(signInFaliure(data.message));
        setSuccessMsg('');
      }
    } catch (error) {
      console.error('Error:', error);
      dispatch(signInFaliure(error.message));
      setSuccessMsg('');
    }
  };

  return (
    <>
      {loading && <FullScreenLoader />}

      {/* ✅ Video Background */}
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

        {/* ✅ Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>

        {/* ✅ Frosted Glass Login Form */}
        <div className="relative z-20 flex items-center justify-center min-h-screen px-4">
          <div className="max-w-md w-full p-6 bg-white/20 backdrop-blur-md shadow-lg rounded-lg border border-white/30">
            <h1 className="text-2xl font-semibold text-center text-white mb-6">Student Login</h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white">
                  Email address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="Your registration email"
                  required
                  autoComplete="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
                  placeholder="******"
                  required
                  autoComplete="current-password"
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
              >
                Sign in
              </button>
            </form>

            {successmsg && (
              <div className="mt-4 text-green-300 text-center">{successmsg}</div>
            )}
            {errorMessage && (
              <div className="mt-4 text-red-300 text-center">{errorMessage}</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
