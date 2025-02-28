import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const context = useContext(AuthContext);
  const location = useLocation();

  if (!context) {
    throw new Error('ProtectedRoute must be used within an AuthProvider');
  }

  const { user, loading } = context;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
