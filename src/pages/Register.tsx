// pages/Register.tsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthError } from '@supabase/supabase-js';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Register must be used within an AuthProvider');
  }

  const { signUp } = context;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error state
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate password strength
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setLoading(true);
      await signUp(email, password);

      // Redirect to login after successful registration
      navigate('/login', {
        state: {
          message: 'Registration successful! Please check your email to confirm your account.',
        },
      });
    } catch (error: unknown) {
      setError(error instanceof AuthError ? error.message : 'Failed to create an account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 bg-white border rounded-lg shadow-md'>
      <h1 className='text-2xl font-bold mb-6 text-center'>Create an Account</h1>

      {error && (
        <div className='mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded'>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-1'>
            Email
          </label>
          <input
            id='email'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='password' className='block text-sm font-medium text-gray-700 mb-1'>
            Password
          </label>
          <input
            id='password'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <div className='mb-6'>
          <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-1'>
            Confirm Password
          </label>
          <input
            id='confirmPassword'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
        </div>

        <button
          type='submit'
          className='w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150'
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>
      </form>

      <div className='mt-4 text-center text-sm text-gray-600'>
        Already have an account?{' '}
        <Link to='/login' className='text-blue-600 hover:text-blue-800 font-medium'>
          Sign in
        </Link>
      </div>
    </div>
  );
};
