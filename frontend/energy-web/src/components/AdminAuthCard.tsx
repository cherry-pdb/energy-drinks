import { useState } from 'react';
import { clearAuth, getAdminUsername, login, saveAuth } from '../api/energyApi';

export function AdminAuthCard({ onAuthChanged }: { onAuthChanged: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const currentUser = getAdminUsername();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const auth = await login({ username, password });
      saveAuth(auth);
      setUsername('');
      setPassword('');
      onAuthChanged();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  if (currentUser) {
    return (
      <div className="auth-card">
        <div className="form-header">
          <h2>Admin access</h2>
          <p>Signed in as <strong>{currentUser}</strong>.</p>
        </div>
        <button className="button button-secondary" onClick={() => { clearAuth(); onAuthChanged(); }}>
          Log out
        </button>
      </div>
    );
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Admin login</h2>
        <p>Only admins can create or edit drinks.</p>
      </div>
      <div className="form-grid single-column">
        <input className="input" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error ? <div className="form-error">{error}</div> : null}
      <button className="button" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
    </form>
  );
}
