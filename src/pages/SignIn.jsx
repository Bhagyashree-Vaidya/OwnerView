import React, { useState } from 'react';
import './SignIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Mock admin login — works offline without backend
    if (formData.email === 'adminov' && formData.password === 'admin') {
      localStorage.setItem('token', 'mock-admin-token');
      setIsLoading(false);
      navigate('/orders');
      return;
    }

    try {
      const response = await axios.post(
        'https://hiteshy44.pythonanywhere.com/api/v1/auth/login/',
        { email: formData.email, password: formData.password }
      );
      const { token } = response.data;
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate('/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signin-page">
      {/* Left panel — branding */}
      <div className="signin-brand">
        <div className="signin-brand__inner">
          <div className="signin-brand__logo">
            <div className="signin-brand__logo-icon">OV</div>
            <span className="signin-brand__logo-name">OwnerView</span>
          </div>
          <h1 className="signin-brand__headline">
            Manage your freelance<br />platform with ease
          </h1>
          <p className="signin-brand__sub">
            The super admin panel for OwnerView — track orders, customers, reviews, and working files all in one place.
          </p>
          <div className="signin-brand__features">
            {['Real-time order tracking', 'Customer management', 'File review workflows', 'Review moderation'].map(f => (
              <div key={f} className="signin-brand__feature">
                <span className="signin-brand__feature-check">✓</span>
                {f}
              </div>
            ))}
          </div>
          {/* Decorative blobs */}
          <div className="signin-brand__blob signin-brand__blob--1" />
          <div className="signin-brand__blob signin-brand__blob--2" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="signin-form-panel">
        <div className="signin-form-wrap">
          <div className="signin-form-header">
            <h2 className="signin-form-title">Welcome back 👋</h2>
            <p className="signin-form-subtitle">Sign in to your admin account</p>
          </div>

          {error && (
            <div className="signin-error">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          <form className="signin-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="email"
                className="form-input signin-input-lg"
                placeholder="adminov"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <a href="#" className="signin-forgot-link">Forgot password?</a>
              </div>
              <input
                type="password"
                name="password"
                className="form-input signin-input-lg"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </div>

            <div className="signin-remember">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Keep me signed in</label>
            </div>

            <button type="submit" className="signin-submit" disabled={isLoading}>
              {isLoading ? (
                <span className="signin-spinner" />
              ) : (
                <>
                  Sign In
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="signin-footer-note">
            Protected admin portal · OwnerView © 2026
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
