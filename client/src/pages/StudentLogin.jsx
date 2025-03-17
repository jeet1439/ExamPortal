import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';

export default function StudentLogin() {
    const [formData, setFormdata] = useState({});
    const [ successmsg, setSuccessMsg] = useState('');

    const { loading, error: errorMessage } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) =>{
    setFormdata({ ...formData, [e.target.id]: e.target.value});
    }

    const handleSubmit = async(e) =>{ 
    e.preventDefault();

    if(!formData.email || !formData.password ){
        return dispatch(signInFaliure('Please fill all the fields'));
    }
    try {
      dispatch(signInStart());
        const res = await fetch('/api/auth/signin-student', {
            method: 'POST',
            headers: { 'content-Type' : 'application/json' },
            body: JSON.stringify(formData),
        });
        const data = await res.json();
        if(res.ok){
            console.log('Signin successful: ', data);
            setSuccessMsg('Login successful!'); 
            navigate('/student-dashboard');
            dispatch(signInSuccess(data));
        }
        if(!res.ok){
            console.error('Sign in failed', data.message);
            dispatch(signInFaliure(data.message));
            setSuccessMsg('');
        }
    } catch (error) {
        console.error('Error:', error);
        dispatch(signInFaliure(error.message));
        setSuccessMsg('');
    }
    }
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
    <div className='w-full max-w-md p-6 bg-white shadow-lg rounded-lg'>
      <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
        Student login
      </h1>
      <form className='space-y-4' onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
            Email address
          </label>
          <input
            type="email"
            id='email'
            className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300'
            placeholder='Your registration email'
            required
            autoComplete='email'
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
            Password
          </label>
          <input
            type="password"
            id='password'
            className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300'
            placeholder='******'
            required
            autoComplete='current-password'
            onChange={handleChange}
          />
        </div>
        <button 
          type='submit'
          disabled={loading}
          className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400'
        >
          Sign in
        </button>
      </form>
      {successmsg && (
          <div className="mt-4 text-green-500 text-center">
            {successmsg}
          </div>
        )}
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">
            {errorMessage}
          </div>
        )}
    </div>
  </div>
  
  )
}
