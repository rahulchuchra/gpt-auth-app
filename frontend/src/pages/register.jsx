import { useState } from 'react';
import apiClient from '../apiClient';

const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const pwOk = (p) => /^(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(p);

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setOk('');
    if (!emailOk(email)) return setErr('Invalid email');
    if (!pwOk(password)) return setErr('Password too weak');

    try {
      const { data } = await apiClient.post('/api/auth/register', { email, password, name });
      console.log('[register] new user id:', data?.user?.id);
      window.location.href = '/login';
      setOk('Registered. You can login now.');
    } catch (e) {
      console.log('[register] fail', e?.response?.data);
      setErr(e?.response?.data?.error || 'Something went wrong');
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white border rounded-md p-5">
        <h1 className="text-xl font-medium mb-4">Register</h1>

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            className="w-full border rounded-md px-3 py-2"
            placeholder="name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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

          <small className="text-stone-600 block">
            8+ chars, include a number and a special character.
          </small>

          {err && <div className="text-sm text-red-600">{err}</div>}
          {ok && <div className="text-sm text-green-600">{ok}</div>}

          <button className="w-full rounded-md bg-black text-white py-2">
            Create Account
          </button>
        </form>

        <p className="mt-3 text-sm">
          Have an account? <a className="underline" href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}
