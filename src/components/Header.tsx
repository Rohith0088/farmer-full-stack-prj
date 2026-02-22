import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useBlendy } from '../context/BlendyContext';
import LanguageSelector from './LanguageSelector';

interface Notification {
  id: number;
  icon: string;
  title: string;
  message: string;
  time: string;
}

const Header: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { toggle, untoggle, update } = useBlendy();
  const [showNotifPanel, setShowNotifPanel] = useState<boolean>(false);

  const notifications: Notification[] = [
    { id: 1, icon: 'crop', title: 'New Crop Alert!', message: 'Fresh Mangoes listed by Ramesh Kumar', time: '2h ago' },
    { id: 2, icon: 'package', title: 'Order Delivered', message: 'Order ORD-1001 delivered', time: '5h ago' },
    { id: 3, icon: 'offer', title: 'Seasonal Offer!', message: '20% off on organic products', time: '2d ago' },
  ];

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'crop':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
      case 'package':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue-600, #2563eb)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
      case 'offer':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--amber-600, #d97706)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v4"/><path d="m6.8 15-3.5 2"/><path d="m20.7 17-3.5-2"/><path d="M6.5 10 3 8"/><path d="m21 8-3.5 2"/><path d="m12 12 8-4.5"/><path d="m12 12v9"/><path d="m12 12L4 7.5"/></svg>;
      default:
        return null;
    }
  };

  useEffect(() => {
    update();
  }, [location, update]);

  const getTitle = (): string => {
    const path = location.pathname;
    if (path === '/') return t('appName');
    if (path === '/cart') return t('cart');
    if (path === '/orders') return t('myOrders');
    if (path === '/favorites') return t('favoriteFarmers');
    if (path === '/profile') return t('myProfile');
    if (path === '/farmer-dashboard') return t('farmerDashboard');
    if (path === '/login') return t('login');
    if (path.startsWith('/product/')) return t('productDetails');
    if (path.startsWith('/farmer/')) return t('farmerProfile');
    if (path.startsWith('/invoice/')) return t('invoice');
    if (path === '/checkout') return t('checkout');
    return t('appName');
  };

  const showBack = location.pathname !== '/';

  return (
    <header className="app-header">
      <div className="header-top">
        <div className="header-left">
          {showBack && (
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← 
            </button>
          )}
          <div className="header-brand" onClick={() => navigate('/')}>
            <span className="brand-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></span>
            <div>
              <h1 className="brand-name">{getTitle()}</h1>
              {location.pathname === '/' && (
                <p className="brand-tagline">{t('tagline')}</p>
              )}
            </div>
          </div>
        </div>
        <div className="header-right">
          <LanguageSelector />
          <button
            className="header-icon-btn"
            data-blendy-from="notif-panel"
            onClick={() => {
              setShowNotifPanel(true);
              setTimeout(() => toggle('notif-panel'), 50);
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
            <span className="notif-dot"></span>
          </button>
        </div>
      </div>

      {/* Notification Panel (Blendy animated) */}
      {showNotifPanel && (
        <div className="notif-overlay" onClick={() => {
          untoggle('notif-panel', () => setShowNotifPanel(false));
        }}>
          <div
            className="notif-panel"
            data-blendy-to="notif-panel"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            <div className="notif-panel-inner">
              <div className="notif-panel-header">
                <h3>Notifications</h3>
                <button className="notif-panel-close" onClick={() => {
                  untoggle('notif-panel', () => setShowNotifPanel(false));
                }}>✕</button>
              </div>
              <div className="notif-panel-list">
                {notifications.map(n => (
                  <div key={n.id} className="notif-panel-item">
                    <span className="notif-panel-icon">{getNotifIcon(n.icon)}</span>
                    <div className="notif-panel-content">
                      <strong>{n.title}</strong>
                      <p>{n.message}</p>
                      <span className="notif-panel-time">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="notif-view-all" onClick={() => {
                untoggle('notif-panel', () => {
                  setShowNotifPanel(false);
                  navigate('/notifications');
                });
              }}>
                View All Notifications →
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
