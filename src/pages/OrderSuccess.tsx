import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById } from '../data/mockData';

const OrderSuccess: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useLanguage();
  const { orders } = useCart();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <p>Order not found</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          {t('home')}
        </button>
      </div>
    );
  }

  const farmerIds = Array.from(new Set(order.items.map(item => item.farmerId)));

  return (
    <div className="order-success-page">
      <div className="success-animation">
        <span className="success-icon">✓</span>
        <h1>{t('orderConfirmed')}</h1>
        <p>{t('orderPlaced')}</p>
        <p className="order-id-display">{t('orderId')}: {order.id}</p>
      </div>

      <div className="success-summary">
        <h2 className="section-title">{t('productDetails')}</h2>
        {order.items.map(item => (
          <div key={item.id} className="success-item">
            <span>{item.name}</span>
            <span>{item.qty} × ₹{item.price} = ₹{item.qty * item.price}</span>
          </div>
        ))}
        <div className="success-total">
          <span>{t('totalAmount')}</span>
          <span>₹{order.total}</span>
        </div>
        <div className="success-payment">
          <span>{t('paymentStatus')}</span>
          <span className={`payment-badge ${order.paymentStatus}`}>
            {order.paymentStatus === 'paid' ? t('paid') : t('pending')}
          </span>
        </div>
      </div>

      <div className="farmer-qr-section">
        <h2 className="section-title">{t('farmerQRCode')}</h2>
        <p className="qr-subtitle">{t('scanToConnect')}</p>
        {farmerIds.map(fid => {
          const farmer = getFarmerById(fid);
          if (!farmer) return null;
          const qrUrl = `${window.location.origin}/farmer/${farmer.id}`;
          return (
            <div key={fid} className="qr-farmer-card">
              <div className="qr-farmer-info">
                <img src={farmer.photo} alt={farmer.name} className="qr-farmer-photo"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Farmer'; }} />
                <div>
                  <h3>{farmer.name}</h3>
                  <p>{farmer.village}</p>
                </div>
              </div>
              <QRCodeSVG
                value={qrUrl}
                size={160}
                bgColor="#ffffff"
                fgColor="#2d5016"
                level="H"
                includeMargin={true}
              />
              <div className="qr-actions">
                <button className="btn-secondary" onClick={() => navigate(`/farmer/${farmer.id}`)}>
                  {t('farmerProfile')}
                </button>
                <button className="btn-whatsapp" onClick={() =>
                  window.open(`https://wa.me/${farmer.whatsapp}`, '_blank')
                }>
                  {t('whatsappChat')}
                </button>
              </div>
              <button className="btn-buy-again" onClick={() => navigate(`/farmer/${farmer.id}`)}>
                {t('buyAgain')}
              </button>
            </div>
          );
        })}
      </div>

      <div className="success-actions">
        <button className="btn-primary btn-large" onClick={() => navigate(`/invoice/${order.id}`)}>
          {t('viewInvoice')}
        </button>
        <button className="btn-success btn-large" onClick={() => navigate('/')}>
          {t('continueShopping')}
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
