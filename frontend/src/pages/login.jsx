import { useState } from 'react';
import apiClient from '../apiClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    try {
      const { data } = await apiClient.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      console.log('[login] ok ->', data.user?.email);
      window.location.href = '/dashboard';
    } catch (e) {
      console.log('[login] fail', e?.response?.data);
      setErr(e?.response?.data?.error || 'Something went wrong');
    }
  }

  const backend = 'http://localhost:4000';

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border rounded-md p-5">
        <h1 className="text-xl font-medium mb-4">Login</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            type="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full border rounded-md px-3 py-2"
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err && <div className="text-sm text-red-600">{err}</div>}
          <button className="w-full rounded-md bg-black text-white py-2">Login</button>
        </form>

        <div className="mt-3 space-y-2">
          <button
            onClick={() => (window.location.href = `${backend}/api/auth/google`)}
            className="w-full border rounded-md py-2"
          >
            Continue with Google
          </button>
          <button
            onClick={() => (window.location.href = `${backend}/api/auth/github`)}
            className="w-full border rounded-md py-2"
          >
            Continue with GitHub
          </button>
        </div>

        <p className="mt-3 text-sm">
          No account? <a className="underline" href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}
