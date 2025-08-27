import { Routes, Route, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Dashboard from './pages/dashboard.jsx';
import AuthGuard from './components/authguard.jsx';

export default function App() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    if (token) {
      console.log('OAuth callback token length:', token.length);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    }
  }, [params, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route path="/oauth-callback" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Signing you in...</p>
          </div>
        </div>
      } />
      <Route path="*" element={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/login" className="btn-primary">
              Go back to login
            </a>
          </div>
        </div>
      } />
    </Routes>
  );
}