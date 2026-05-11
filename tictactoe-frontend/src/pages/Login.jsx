import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import '../styles/auth.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const data = await loginUser(username.trim(), password);
      if (data.success) {
        onLogin(data.user);
        navigate('/');
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login gagal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>

      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🎮</div>
          <h1 className="auth-title">TIC TAC TOE QUIZ</h1>
          <p className="auth-subtitle">Realtime Multiplayer</p>
          <p className="auth-description">Login untuk bermain bersama teman secara realtime</p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="auth-input"
                placeholder="Masukkan username"
                disabled={loading}
                autoComplete="username"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                placeholder="Masukkan password"
                disabled={loading}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sedang Login...
              </>
            ) : (
              <>Login</>
            )}
          </button>
        </form>

        <div className="auth-divider">atau</div>

        <Link to="/register" className="auth-secondary-button">
          Daftar Sekarang
        </Link>
      </div>
    </div>
  );
};

export default Login;

