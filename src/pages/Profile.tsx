import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';

const Profile: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, loading: authLoading } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Local form state — seeded from profile
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    email: '',
    age: '',
    city: '',
    area: '',
  });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        email: profile.email || '',
        age: profile.age || '',
        city: profile.city || '',
        area: profile.area || '',
      });
    } else if (user) {
      setForm(prev => ({
        ...prev,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        age: user.user_metadata?.age || '',
        city: user.user_metadata?.city || '',
        area: user.user_metadata?.area || '',
      }));
    }
  }, [profile, user]);

  /* ---------- Save profile ---------- */
  const handleSave = async () => {
    setSaving(true);
    setSaveMsg('');
    const { error } = await updateProfile({
      full_name: form.full_name,
      phone: form.phone,
      age: form.age,
      city: form.city,
      area: form.area,
    });
    setSaving(false);
    if (error) {
      setSaveMsg('Failed to save. Please try again.');
    } else {
      setSaveMsg('Profile updated!');
      setIsEditing(false);
      setTimeout(() => setSaveMsg(''), 3000);
    }
  };

  /* ---------- Logout ---------- */
  const handleLogout = async () => {
    setLoggingOut(true);
    // Navigate immediately for instant feedback
    navigate('/login');
    try {
      await signOut();
    } catch {
      // Already navigated to login, ignore errors
    }
    setLoggingOut(false);
  };

  /* ---------- If not logged in ---------- */
  if (authLoading) {
    return (
      <div className="auth-page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          style={{ width: 40, height: 40, border: '4px solid #e0e0e0', borderTopColor: '#16a34a', borderRadius: '50%' }}
        />
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        className="auth-page"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', padding: '60px 24px' }}
      >
        <h2 style={{ marginBottom: 12 }}>Not signed in</h2>
        <p style={{ marginBottom: 24, color: '#666' }}>Please sign in to view your profile.</p>
        <button className="auth-btn auth-btn-primary" onClick={() => navigate('/login')} style={{ maxWidth: 260, margin: '0 auto' }}>
          Go to Login
        </button>
      </motion.div>
    );
  }

  const initials = form.full_name
    ? form.full_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  /* ---------- Menu items ---------- */
  const menuItems = [
    { icon: '📦', label: t('myOrders'), path: '/orders' },
    { icon: '❤️', label: t('favoriteFarmers'), path: '/favorites' },
    { icon: '🌾', label: t('farmerDashboard'), path: '/farmer-dashboard' },
    { icon: '🔔', label: t('notifications'), path: '/notifications' },
  ];

  return (
    <motion.div
      className="profile-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* -------- Avatar & Name -------- */}
      <motion.div
        className="profile-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 120 }}
      >
        <motion.div
          className="profile-avatar"
          style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 700,
            margin: '0 auto 12px',
            boxShadow: '0 4px 14px rgba(22,163,74,0.3)',
          }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          {initials}
        </motion.div>
        <h2 style={{ margin: '0 0 4px' }}>{form.full_name || 'User'}</h2>
        <p style={{ color: '#666', fontSize: 14, margin: 0 }}>{form.email}</p>
        {profile?.role && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{
              display: 'inline-block',
              marginTop: 8,
              padding: '4px 14px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 600,
              textTransform: 'capitalize',
              background: profile.role === 'farmer' ? '#fef3c7' : '#dbeafe',
              color: profile.role === 'farmer' ? '#92400e' : '#1e40af',
            }}
          >
            {profile.role}
          </motion.span>
        )}
      </motion.div>

      {/* -------- Save message -------- */}
      <AnimatePresence>
        {saveMsg && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              textAlign: 'center',
              padding: '10px 16px',
              margin: '12px 16px 0',
              borderRadius: 10,
              fontSize: 14,
              fontWeight: 500,
              background: saveMsg.includes('Failed') ? '#fef2f2' : '#ecfdf5',
              color: saveMsg.includes('Failed') ? '#b91c1c' : '#166534',
            }}
          >
            {saveMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* -------- Profile Details / Edit Form -------- */}
      <motion.div
        className="profile-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        style={{ margin: '20px 16px', background: '#fff', borderRadius: 16, padding: '20px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
      >
        <h3 className="section-title" style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>{t('myProfile')}</h3>

        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="profile-form"
            >
              {[ 
                { label: t('name'), key: 'full_name', type: 'text' },
                { label: 'Age', key: 'age', type: 'number' },
                { label: t('phoneNumber'), key: 'phone', type: 'tel' },
                { label: 'City', key: 'city', type: 'text' },
                { label: 'Area / Locality', key: 'area', type: 'text' },
              ].map((field, i) => (
                <motion.div
                  key={field.key}
                  className="form-group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  style={{ marginBottom: 14 }}
                >
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>{field.label}</label>
                  <input
                    type={field.type}
                    className="form-input"
                    value={(form as any)[field.key]}
                    onChange={e => setForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1.5px solid #e5e7eb',
                      borderRadius: 10,
                      fontSize: 15,
                      transition: 'border-color 0.2s',
                      outline: 'none',
                    }}
                  />
                </motion.div>
              ))}

              {/* Email (read-only) */}
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#555', marginBottom: 6 }}>{t('email')}</label>
                <input
                  type="email"
                  className="form-input"
                  value={form.email}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    border: '1.5px solid #e5e7eb',
                    borderRadius: 10,
                    fontSize: 15,
                    background: '#f9fafb',
                    color: '#888',
                  }}
                />
              </div>

              <div className="form-actions" style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-success"
                  onClick={handleSave}
                  disabled={saving}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 10,
                    border: 'none',
                    background: 'linear-gradient(135deg, #16a34a, #15803d)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  {saving ? 'Saving...' : t('save')}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-secondary"
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 10,
                    border: '1.5px solid #e5e7eb',
                    background: '#fff',
                    color: '#333',
                    fontWeight: 600,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  {t('cancel')}
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              className="profile-details"
            >
              {[
                { icon: '👤', label: t('name'), value: form.full_name },
                { icon: '🎂', label: 'Age', value: form.age ? `${form.age} years` : '' },
                { icon: '📞', label: t('phoneNumber'), value: form.phone },
                { icon: '📧', label: t('email'), value: form.email },
                { icon: '🏙️', label: 'City', value: form.city },
                { icon: '📍', label: 'Area', value: form.area },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="profile-detail-item"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 0',
                    borderBottom: '1px solid #f3f4f6',
                  }}
                >
                  <span style={{ fontSize: 22 }}>{item.icon}</span>
                  <div>
                    <span style={{ display: 'block', fontSize: 12, color: '#999', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ display: 'block', fontSize: 15, color: '#222', fontWeight: 500 }}>
                      {item.value || '—'}
                    </span>
                  </div>
                </motion.div>
              ))}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="btn-primary btn-full"
                onClick={() => setIsEditing(true)}
                style={{
                  width: '100%',
                  marginTop: 16,
                  padding: '12px',
                  borderRadius: 10,
                  border: 'none',
                  background: 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                }}
              >
                ✏️ {t('editProfile')}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* -------- Menu -------- */}
      <motion.div
        className="profile-menu"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        style={{ margin: '0 16px 20px', background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}
      >
        {menuItems.map((item, i) => (
          <motion.button
            key={item.path}
            className="menu-item"
            onClick={() => navigate(item.path)}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.06 }}
            whileHover={{ backgroundColor: '#f0fdf4' }}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              padding: '14px 16px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 15,
              gap: 12,
              borderBottom: '1px solid #f3f4f6',
            }}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ flex: 1, textAlign: 'left', fontWeight: 500, color: '#333' }}>{item.label}</span>
            <span style={{ color: '#bbb', fontSize: 18 }}>›</span>
          </motion.button>
        ))}
      </motion.div>

      {/* -------- Logout -------- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{ margin: '0 16px 40px' }}
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          className="btn-logout"
          onClick={handleLogout}
          disabled={loggingOut}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: 12,
            border: '1.5px solid #fecaca',
            background: '#fff',
            color: '#dc2626',
            fontWeight: 600,
            fontSize: 15,
            cursor: loggingOut ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          {loggingOut ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                style={{ display: 'inline-block', width: 18, height: 18, border: '2.5px solid #fecaca', borderTopColor: '#dc2626', borderRadius: '50%' }}
              />
              Signing out...
            </>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              {t('logout')}
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Profile;
