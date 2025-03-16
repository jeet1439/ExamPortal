import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { signInStart, signInSuccess, signInFaliure } from '../redux/user/userSlice';

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
                console.log('Signin successful: ', data);
                dispatch(signInSuccess(data));
                setSuccessMsg('Admin Login successful!');
            } else {
                console.error('Sign in failed', data.message);
                dispatch(signInFaliure(data.message));
                setSuccessMsg('');
            }
        } catch (error) {
            console.error('Error:', error);
            setSuccessMsg('');
            dispatch(signInFaliure(error.message));
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-gray-100'>
            <div className='w-full max-w-md p-6 bg-white shadow-lg rounded-lg'>
                <h1 className='text-2xl font-semibold text-center text-gray-800 mb-6'>
                    Admin Login
                </h1>
                <form className='space-y-4' onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                            Email address
                        </label>
                        <input
                            type='email'
                            id='email'
                            className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300'
                            placeholder='Admin email'
                            required
                            autoComplete='email'
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='password'
                            className='w-full px-4 py-2 border rounded-lg focus:ring focus:ring-green-300'
                            placeholder='******'
                            required
                            autoComplete='current-password'
                            onChange={handleChange}
                        />
                    </div>
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400'
                    >
                        Sign in
                    </button>
                </form>
                {successMsg && (
                    <div className='mt-4 text-green-500 text-center'>
                        {successMsg}
                    </div>
                )}
                {errorMessage && (
                    <div className='mt-4 text-red-500 text-center'>
                        {errorMessage}
                    </div>
                )}
            </div>
        </div>
    );
}
