import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface NotificationItem {
  id: number;
  type: string;
  icon: string;
  title: string;
  message: string;
  time: string;
  farmerId?: string;
}

const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'leaf':
      case 'dairy':
      case 'grape':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>;
      case 'box':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>;
      case 'star':
        return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
      default:
        return null;
    }
  };

  const notifications: NotificationItem[] = [
    { id: 1, type: 'crop', icon: 'leaf', title: 'New Crop Alert!', message: 'Ramesh Kumar has listed fresh Mangoes', time: '2 hours ago', farmerId: 'f1' },
    { id: 2, type: 'order', icon: 'box', title: 'Order Delivered', message: 'Your order ORD-1001 has been delivered', time: '5 hours ago' },
    { id: 3, type: 'crop', icon: 'dairy', title: 'Fresh Dairy Available!', message: 'Priya Sharma has fresh A2 Milk today', time: '1 day ago', farmerId: 'f6' },
    { id: 4, type: 'offer', icon: 'star', title: 'Seasonal Offer!', message: '20% off on all organic products this week', time: '2 days ago' },
    { id: 5, type: 'crop', icon: 'grape', title: 'Grape Season!', message: 'Suresh Patel from Nashik has fresh Thompson grapes', time: '3 days ago', farmerId: 'f3' },
  ];

  return (
    <div className="notifications-page">
      <div className="notifications-list">
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`notification-card notif-${notif.type}`}
            onClick={() => notif.farmerId && navigate(`/farmer/${notif.farmerId}`)}
          >
            <span className="notif-icon">{getNotifIcon(notif.icon)}</span>
            <div className="notif-content">
              <h4 className="notif-title">{notif.title}</h4>
              <p className="notif-message">{notif.message}</p>
              <span className="notif-time">{notif.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
