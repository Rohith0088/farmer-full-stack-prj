import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

const Login: React.FC = () => {
  const { t } = useLanguage();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (searchParams.get('confirmed') === 'true') {
      setConfirmed(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setEmailNotConfirmed(false);
    setResendSuccess('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      const msg = signInError.message.toLowerCase();
      if (msg.includes('email not confirmed') || msg.includes('email_not_confirmed')) {
        setEmailNotConfirmed(true);
        setError('Email not confirmed. Please check your inbox or resend the confirmation email.');
      } else {
        setError(signInError.message);
      }
    } else {
      navigate('/');
    }
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setResendLoading(true);
    setResendSuccess('');
    setError('');

    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (resendError) {
        setError(resendError.message || 'Failed to resend confirmation email.');
      } else {
        setResendSuccess('Confirmation email sent! Please check your inbox (and spam folder).');
        setEmailNotConfirmed(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
    setResendLoading(false);
  };

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 18 }}
      >
        {/* Header */}
        <motion.div
          className="auth-header"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <motion.div
            className="auth-logo"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </motion.div>
          <h1>{t('appName') || 'AgriTech'}</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </motion.div>

        {/* Confirmed Banner */}
        <AnimatePresence>
          {confirmed && (
            <motion.div
              className="auth-success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#e6f9e6', color: '#2d5016', padding: '12px 16px', borderRadius: 10, marginBottom: 12, fontSize: 14, textAlign: 'center' }}
            >
              ✓ Email confirmed successfully! You can now sign in.
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Success */}
        <AnimatePresence>
          {resendSuccess && (
            <motion.div
              className="auth-success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ background: '#e6f9e6', color: '#2d5016', padding: '12px 16px', borderRadius: 10, marginBottom: 12, fontSize: 14, textAlign: 'center' }}
            >
              {resendSuccess}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Resend Confirmation Button */}
        <AnimatePresence>
          {emailNotConfirmed && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="button"
              onClick={handleResendConfirmation}
              disabled={resendLoading}
              className="auth-btn"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: 'white',
                border: 'none',
                padding: '12px 20px',
                borderRadius: 50,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                marginBottom: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              {resendLoading ? (
                <motion.span
                  className="auth-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                  style={{ width: 18, height: 18, display: 'inline-block', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
                />
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="23 4 23 10 17 10" />
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                  </svg>
                  Resend Confirmation Email
                </>
              )}
            </motion.button>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          <motion.div
            className="auth-field"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.35 }}
          >
            <label htmlFor="email">Email Address</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>
          </motion.div>

          <motion.div
            className="auth-field"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.35 }}
          >
            <label htmlFor="password">Password</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn auth-btn-primary"
            disabled={loading}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.35 }}
            whileHover={{ scale: 1.02, boxShadow: '0 6px 20px rgba(22,163,74,0.3)' }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? (
              <motion.span
                className="auth-spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                style={{ display: 'inline-block', width: 20, height: 20, border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%' }}
              />
            ) : (
              'Sign In'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <motion.div
          className="auth-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.3 }}
        >
          <p>
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="auth-link">Create Account</Link>
          </p>
        </motion.div>

        {/* Skip */}
        <motion.button
          className="auth-skip"
          onClick={() => navigate('/')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
          whileHover={{ x: 4 }}
        >
          Skip & Browse Products
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Login;
