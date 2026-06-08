import React, { useState } from 'react';
import api from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setAuth = useAuthStore(s => s.setAuth);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth(data, data.token);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input className="form-input" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" required />
      <input className="form-input" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" required />
      {error && <p style={{ color: 'var(--red)', fontSize: 13 }}>{error}</p>}
      <button className="run-btn" type="submit">Sign In</button>
    </form>
  );
}
