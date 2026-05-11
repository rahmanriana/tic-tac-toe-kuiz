import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/auth.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!username.trim() || !password || !confirmPassword) {
      setError('Semua field harus diisi');
      return;
    }
    if (password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi tidak cocok');
      return;
    }

    setLoading(true);
    try {
      const data = await registerUser(username.trim(), password);
      if (data.success) {
        navigate('/login');
      } else {
        setError(data.message || 'Register gagal');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Register gagal');
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
          <div className="auth-icon">✨</div>
          <h1 className="auth-title">BUAT AKUN</h1>
          <p className="auth-subtitle">Bergabung dengan pemain lain</p>
          <p className="auth-description">Daftar sekarang untuk bermain realtime dengan teman-temanmu</p>
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
                placeholder="Pilih username unik"
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
                placeholder="Minimal 6 karakter"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Konfirmasi Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔐</span>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="auth-input"
                placeholder="Ulangi password"
                disabled={loading}
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner"></span>
                Sedang Mendaftar...
              </>
            ) : (
              <>Daftar</>
            )}
          </button>
        </form>

        <div className="auth-divider">atau</div>

        <Link to="/login" className="auth-secondary-button">
          Sudah punya akun? Login
        </Link>
      </div>
    </div>
  );
};

export default Register;

