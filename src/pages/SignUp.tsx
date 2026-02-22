import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

/* Indian metro cities for suggestions */
const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai',
  'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur',
  'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara',
  'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Ranchi', 'Meerut',
  'Rajkot', 'Varanasi', 'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar',
  'Allahabad', 'Gwalior', 'Jabalpur', 'Coimbatore', 'Vijayawada',
  'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh', 'Guwahati',
  'Solapur', 'Hubli', 'Mysore', 'Tiruchirappalli', 'Bareilly',
  'Aligarh', 'Tiruppur', 'Moradabad', 'Jalandhar', 'Bhubaneswar',
  'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur',
  'Gorakhpur', 'Bikaner', 'Amravati', 'Noida', 'Jamshedpur',
  'Bhilai', 'Cuttack', 'Firozabad', 'Kochi', 'Nellore',
  'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol', 'Rourkela',
  'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga',
  'Jamnagar', 'Ujjain', 'Loni', 'Siliguri', 'Jhansi',
];

const SPRING = { type: 'spring' as const, duration: 0.4, bounce: 0.1 };
const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const SignUp: React.FC = () => {
  const { t } = useLanguage();
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'farmer'>('customer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const filteredCities = city.length > 0
    ? INDIAN_CITIES.filter(c => c.toLowerCase().startsWith(city.toLowerCase())).slice(0, 5)
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) { setError('Please enter a valid age.'); return; }
    if (!phone.trim()) { setError('Please enter your phone number.'); return; }
    if (!city.trim()) { setError('Please enter your city.'); return; }
    if (!area.trim()) { setError('Please enter your area/locality.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: signUpError } = await signUp(email, password, fullName, phone, age, city, area, role);

    if (signUpError) {
      setLoading(false);
      setError(signUpError.message);
    } else {
      // Supabase automatically sends a confirmation email on signUp
      setLoading(false);
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <motion.div
          className="auth-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={SPRING}
        >
          <div className="auth-header">
            <motion.div
              className="auth-logo"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...SPRING, delay: 0.1 }}
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </motion.div>
            <motion.h1 {...FADE_UP} transition={{ ...SPRING, delay: 0.15 }}>Account Created!</motion.h1>
            <motion.p className="auth-subtitle" {...FADE_UP} transition={{ ...SPRING, delay: 0.2 }}>
              Please check your email to verify your account, then sign in.
            </motion.p>
          </div>
          <motion.div {...FADE_UP} transition={{ ...SPRING, delay: 0.3 }}>
            <Link to="/login" className="auth-btn auth-btn-primary" style={{ textAlign: 'center', display: 'block', textDecoration: 'none' }}>
              Go to Sign In
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING}
      >
        {/* Header */}
        <div className="auth-header">
          <motion.div
            className="auth-logo"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ ...SPRING, duration: 0.5 }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </motion.div>
          <h1>{t('appName') || 'AgriTech'}</h1>
          <p className="auth-subtitle">Create your account</p>
        </div>

        {/* Role Toggle */}
        <div className="auth-role-toggle" style={{ position: 'relative' }}>
          <button
            type="button"
            className={`auth-role-btn ${role === 'customer' ? 'active' : ''}`}
            onClick={() => setRole('customer')}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            Customer
          </button>
          <button
            type="button"
            className={`auth-role-btn ${role === 'farmer' ? 'active' : ''}`}
            onClick={() => setRole('farmer')}
            style={{ position: 'relative', zIndex: 1 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Farmer
          </button>
        </div>

        {/* Error with animation */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="auth-error"
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              transition={SPRING}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form */}
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Full Name */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.05 }}>
            <label htmlFor="fullName">Full Name</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Enter your full name"
                required
                autoComplete="name"
              />
            </div>
          </motion.div>

          {/* Email */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.1 }}>
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

          {/* Age */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.12 }}>
            <label htmlFor="age">Age</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="Enter your age"
                required
              />
            </div>
          </motion.div>

          {/* Phone */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.15 }}>
            <label htmlFor="phone">Phone Number</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 XXXXX XXXXX"
                required
                autoComplete="tel"
              />
            </div>
          </motion.div>

          {/* City with autocomplete */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.2 }} style={{ position: 'relative' }}>
            <label htmlFor="city">City</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <input
                id="city"
                type="text"
                value={city}
                onChange={e => { setCity(e.target.value); setShowCitySuggestions(true); }}
                onFocus={() => setShowCitySuggestions(true)}
                onBlur={() => setTimeout(() => setShowCitySuggestions(false), 150)}
                placeholder="e.g. Hyderabad"
                required
                autoComplete="off"
              />
            </div>
            {/* City suggestions dropdown */}
            <AnimatePresence>
              {showCitySuggestions && filteredCities.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    background: 'white',
                    borderRadius: 8,
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                    border: '1px solid #e2e8f0',
                    listStyle: 'none',
                    padding: '4px 0',
                    zIndex: 50,
                    maxHeight: 200,
                    overflow: 'auto',
                  }}
                >
                  {filteredCities.map((c, i) => (
                    <motion.li
                      key={c}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      onMouseDown={() => { setCity(c); setShowCitySuggestions(false); }}
                      style={{
                        padding: '10px 14px',
                        cursor: 'pointer',
                        fontSize: 14,
                        color: '#334155',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#f1f5f9')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      {c}
                    </motion.li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Area / Locality */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.22 }}>
            <label htmlFor="area">Area / Locality</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <input
                id="area"
                type="text"
                value={area}
                onChange={e => setArea(e.target.value)}
                placeholder="e.g. Ameerpet, Kukatpally"
                required
                autoComplete="address-level3"
              />
            </div>
          </motion.div>

          {/* Password */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.25 }}>
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
                placeholder="Min. 6 characters"
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>
            {/* Password strength indicator */}
            {password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                style={{ marginTop: 6 }}
              >
                <div style={{ height: 4, borderRadius: 2, background: '#e2e8f0', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: password.length < 6 ? '30%' : password.length < 10 ? '65%' : '100%',
                    }}
                    transition={SPRING}
                    style={{
                      height: '100%',
                      borderRadius: 2,
                      background: password.length < 6 ? '#ef4444' : password.length < 10 ? '#f59e0b' : '#10b981',
                    }}
                  />
                </div>
                <span style={{ fontSize: 11, color: password.length < 6 ? '#ef4444' : password.length < 10 ? '#f59e0b' : '#10b981', marginTop: 2, display: 'block' }}>
                  {password.length < 6 ? 'Too short' : password.length < 10 ? 'Good' : 'Strong'}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Confirm Password */}
          <motion.div className="auth-field" {...FADE_UP} transition={{ ...SPRING, delay: 0.3 }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="auth-input-wrapper">
              <svg className="auth-input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>
            {/* Match indicator */}
            <AnimatePresence>
              {confirmPassword.length > 0 && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{
                    fontSize: 11,
                    marginTop: 4,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: password === confirmPassword ? '#10b981' : '#ef4444',
                  }}
                >
                  {password === confirmPassword ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      Passwords don't match
                    </>
                  )}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.button
            type="submit"
            className="auth-btn auth-btn-primary"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.01 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            transition={SPRING}
          >
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              'Create Account'
            )}
          </motion.button>
        </form>

        {/* Footer */}
        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUp;
