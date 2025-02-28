import { useState, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { AuthError } from '@supabase/supabase-js';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Login must be used within an AuthProvider');
  }

  const { signIn, signInAnonymously } = context;
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
      <div className='mt-4 flex flex-col gap-4 text-center'>
        <div className='text-gray-500'>or</div>
        <button
          onClick={async () => {
            try {
              setLoading(true);
              await signInAnonymously();
              navigate(from, { replace: true });
            } catch (error) {
              setError('Failed to sign in anonymously');
            } finally {
              setLoading(false);
            }
          }}
          className='w-full p-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors'
          disabled={loading}
        >
          Continue as Guest
        </button>
        
        <div className='text-sm text-gray-600'>
          Don't have an account?{' '}
          <Link to='/register' className='text-blue-500'>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};
