import { Navigate } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('[AuthGuard] No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  return children;
}