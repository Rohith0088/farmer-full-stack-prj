import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById } from '../data/mockData';

const Orders: React.FC = () => {
  const { t } = useLanguage();
  const { orders } = useCart();
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <h2>No orders yet</h2>
        <p>Start shopping to see your orders here</p>
        <button className="btn-primary btn-large" onClick={() => navigate('/')}>
          {t('startShopping')}
        </button>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span className="order-card-id">{order.id}</span>
              <span className={`order-status status-${order.status}`}>
                {order.status === 'confirmed' ? 'Confirmed' : order.status}
              </span>
            </div>
            <div className="order-card-body">
              <p className="order-date">{new Date(order.date).toLocaleString('en-IN')}</p>
              <div className="order-items-preview">
                {order.items.map(item => (
                  <span key={item.id} className="order-item-tag">
                    {item.name} ×{item.qty}
                  </span>
                ))}
              </div>
              <div className="order-card-footer">
                <span className="order-total">₹{order.total}</span>
                <span className={`payment-badge ${order.paymentStatus}`}>
                  {order.paymentStatus === 'paid' ? t('paid') : t('pending')}
                </span>
              </div>
            </div>
            <div className="order-card-actions">
              <button className="btn-secondary-sm" onClick={() => navigate(`/invoice/${order.id}`)}>
                {t('viewInvoice')}
              </button>
              <button className="btn-secondary-sm" onClick={() => navigate(`/order-success/${order.id}`)}>
                QR {t('connectDirectly')}
              </button>
              <button className="btn-primary-sm" onClick={() => navigate('/')}>
                {t('buyAgain')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
