import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AuthError } from '@supabase/supabase-js';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      setError(error instanceof AuthError ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto mt-10 p-6 border rounded shadow'>
      <h1 className='text-xl font-bold mb-4'>Login</h1>
      {error && <div className='mb-4 text-red-500'>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className='mb-4'>
          <label className='block mb-1'>Email:</label>
          <input
            type='email'
            className='w-full p-2 border rounded'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Password:</label>
          <input
            type='password'
            className='w-full p-2 border rounded'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type='submit'
          className='w-full p-2 bg-blue-500 text-white rounded'
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <div className='mt-4 text-center'>
        Don't have an account?{' '}
        <a href='/register' className='text-blue-500'>
          Register
        </a>
      </div>
    </div>
  );
};
