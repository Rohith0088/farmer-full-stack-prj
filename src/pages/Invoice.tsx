import React, { useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { getFarmerById } from '../data/mockData';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const Invoice: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useLanguage();
  const { orders } = useCart();
  const navigate = useNavigate();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="empty-state">
        <span className="empty-icon">—</span>
        <p>Invoice not found</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          {t('home')}
        </button>
      </div>
    );
  }

  const handleDownloadPDF = async (): Promise<void> => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`AgriTech_Invoice_${order.id}.pdf`);
    } catch (error) {
      console.error('PDF generation failed:', error);
      window.print();
    }
  };

  const handleShareWhatsApp = (): void => {
    const text = `Invoice - ${order.id}%0A` +
      `Customer: ${order.customerName}%0A` +
      `Total: ₹${order.total}%0A` +
      `Date: ${new Date(order.date).toLocaleString('en-IN')}%0A` +
      `Payment: ${order.paymentStatus}%0A%0A` +
      `Items:%0A` +
      order.items.map(item => `${item.emoji} ${item.name} × ${item.qty} = ₹${item.price * item.qty}`).join('%0A');
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const farmerIds = Array.from(new Set(order.items.map(item => item.farmerId)));

  return (
    <div className="invoice-page">
      <div className="invoice-container" id="invoice-print" ref={invoiceRef}>
        <div className="invoice-header">
          <div className="invoice-brand">
            <span className="invoice-logo">AT</span>
            <h1>AgriTech Marketplace</h1>
            <p>Fresh from Farm to Your Home</p>
          </div>
          <div className="invoice-title">
            <h2>{t('invoice')}</h2>
            <p className="invoice-stamp">TAMPER-PROOF</p>
          </div>
        </div>

        <div className="invoice-details">
          <div className="invoice-detail-row">
            <span className="invoice-label">{t('orderId')}:</span>
            <span className="invoice-value">{order.id}</span>
          </div>
          <div className="invoice-detail-row">
            <span className="invoice-label">{t('dateTime')}:</span>
            <span className="invoice-value">{new Date(order.date).toLocaleString('en-IN')}</span>
          </div>
          <div className="invoice-detail-row">
            <span className="invoice-label">{t('customerName')}:</span>
            <span className="invoice-value">{order.customerName}</span>
          </div>
          <div className="invoice-detail-row">
            <span className="invoice-label">{t('phoneNumber')}:</span>
            <span className="invoice-value">{order.customerPhone}</span>
          </div>
          <div className="invoice-detail-row">
            <span className="invoice-label">{t('deliveryAddress')}:</span>
            <span className="invoice-value">{order.deliveryAddress}</span>
          </div>
          {farmerIds.map(fid => {
            const farmer = getFarmerById(fid);
            return farmer ? (
              <div key={fid} className="invoice-detail-row">
                <span className="invoice-label">{t('farmer')}:</span>
                <span className="invoice-value">{farmer.name} — {farmer.village}</span>
              </div>
            ) : null;
          })}
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>{t('productDetails')}</th>
              <th>{t('quantity')}</th>
              <th>{t('price')}</th>
              <th>{t('totalAmount')}</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.qty} {item.unit}</td>
                <td>₹{item.price}</td>
                <td>₹{item.price * item.qty}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} className="invoice-total-label">{t('totalAmount')}</td>
              <td className="invoice-total-value">₹{order.total}</td>
            </tr>
          </tfoot>
        </table>

        <div className="invoice-payment">
          <span className="invoice-label">{t('paymentMethod')}:</span>
          <span className="invoice-value">{order.paymentMethod === 'cod' ? t('cod') : t('upi')}</span>
          <span className={`payment-badge ${order.paymentStatus}`}>
            {order.paymentStatus === 'paid' ? t('paid') : t('pending')}
          </span>
        </div>

        <div className="invoice-footer">
          <p>Thank you for supporting Indian farmers!</p>
          <p>AgriTech Marketplace — Digital Mandi</p>
        </div>
      </div>

      <div className="invoice-actions">
        <button className="btn-primary btn-large" onClick={handleDownloadPDF}>
          {t('downloadPDF')}
        </button>
        <button className="btn-whatsapp btn-large" onClick={handleShareWhatsApp}>
          {t('shareWhatsApp')}
        </button>
      </div>
    </div>
  );
};

export default Invoice;
