import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useProducts } from '../context/ProductContext';
import { farmers } from '../data/mockData';

interface NewProduct {
  name: string;
  category: string;
  price: string;
  quantity: string;
  description: string;
  method: string;
}

interface ProductImage {
  file: File;
  preview: string;
}

interface RepeatCustomer {
  name: string;
  orders: number;
  lastOrder: string;
  phone: string;
}

interface RecentOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: string;
}

interface EarningsData {
  amount: number;
  orders: number;
}

const FarmerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const farmer = farmers[0];
  const { products: allProducts, addProduct: addProductToStore, removeProduct, updateProduct: updateProductInStore } = useProducts();
  const farmerProducts = allProducts.filter(p => p.farmerId === farmer.id);

  const [activeTab, setActiveTab] = useState<string>('overview');
  const [showAddProduct, setShowAddProduct] = useState<boolean>(false);
  const [earningsView, setEarningsView] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: '', category: 'vegetables', price: '', quantity: '', description: '', method: 'Organic'
  });
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [editingProductId, setEditingProductId] = useState<number | string | null>(null);
  const [editImages, setEditImages] = useState<ProductImage[]>([]);
  const [editForm, setEditForm] = useState<{ name: string; price: string; quantity: string; description: string; method: string }>({
    name: '', price: '', quantity: '', description: '', method: 'Organic',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const quickUploadRef = useRef<HTMLInputElement>(null);

  /* ---------- Image handling helpers ---------- */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const files = e.target.files;
    if (!files) return;
    const newImages: ProductImage[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        newImages.push({ file, preview: URL.createObjectURL(file) });
      }
    });
    if (target === 'add') {
      setProductImages(prev => [...prev, ...newImages].slice(0, 5));
    } else {
      setEditImages(prev => [...prev, ...newImages].slice(0, 5));
    }
    // Reset input so same file can be re-selected
    e.target.value = '';
  };

  const removeImage = (index: number, target: 'add' | 'edit') => {
    if (target === 'add') {
      setProductImages(prev => {
        const removed = prev[index];
        if (removed) URL.revokeObjectURL(removed.preview);
        return prev.filter((_, i) => i !== index);
      });
    } else {
      setEditImages(prev => {
        const removed = prev[index];
        if (removed) URL.revokeObjectURL(removed.preview);
        return prev.filter((_, i) => i !== index);
      });
    }
  };

  const earnings: Record<string, EarningsData> = {
    daily: { amount: 2450, orders: 8 },
    weekly: { amount: 15800, orders: 42 },
    monthly: { amount: 68500, orders: 178 },
  };

  const repeatCustomers: RepeatCustomer[] = [
    { name: 'Anita Sharma', orders: 12, lastOrder: '2026-02-19', phone: '+91 98765 11111' },
    { name: 'Rajesh Kumar', orders: 8, lastOrder: '2026-02-18', phone: '+91 98765 22222' },
    { name: 'Meena Patel', orders: 6, lastOrder: '2026-02-17', phone: '+91 98765 33333' },
    { name: 'Sunil Reddy', orders: 15, lastOrder: '2026-02-20', phone: '+91 98765 44444' },
  ];

  const recentOrders: RecentOrder[] = [
    { id: 'ORD-1001', customer: 'Anita S.', items: 'Tomato 5kg, Carrot 2kg', total: 220, status: 'delivered' },
    { id: 'ORD-1002', customer: 'Rajesh K.', items: 'Mango 3kg', total: 360, status: 'shipped' },
    { id: 'ORD-1003', customer: 'Kavitha M.', items: 'Watermelon 10kg', total: 250, status: 'pending' },
    { id: 'ORD-1004', customer: 'Sunil R.', items: 'Honey 1kg', total: 450, status: 'delivered' },
  ];

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    // Build image URL: use first uploaded image preview or a placeholder
    const mainImage = productImages.length > 0
      ? productImages[0].preview
      : 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop';
    const allImages = productImages.length > 0
      ? productImages.map(img => img.preview)
      : [mainImage];

    // Determine emoji based on category
    const categoryEmojis: Record<string, string> = {
      fruits: '🍎', vegetables: '🥦', grains: '🌾', dairy: '🥛', organic: '🌿',
    };

    addProductToStore({
      name: newProduct.name,
      emoji: categoryEmojis[newProduct.category] || '🛒',
      category: newProduct.category,
      image: mainImage,
      images: allImages,
      farmerId: farmer.id,
      price: Number(newProduct.price),
      unit: 'kg',
      availableQty: Number(newProduct.quantity),
      freshness: 'fresh',
      harvestDate: new Date().toISOString().slice(0, 10),
      farmingMethod: newProduct.method,
      description: newProduct.description || `Fresh ${newProduct.name} from ${farmer.name}'s farm`,
      source: 'local',
    });

    alert(`✅ "${newProduct.name}" added successfully! It's now visible on the Home page.`);
    // Don't revoke blob URLs since they're now used in the product list
    setProductImages([]);
    setShowAddProduct(false);
    setNewProduct({ name: '', category: 'vegetables', price: '', quantity: '', description: '', method: 'Organic' });
  };

  return (
    <div className="farmer-dashboard-page">
      <div className="dashboard-header">
        <div className="dashboard-farmer-info">
          <img src={farmer.photo} alt={farmer.name} className="dashboard-farmer-photo"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/60x60?text=Farmer'; }} />
          <div>
            <h2>{farmer.name}</h2>
            <p>{farmer.village}</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card stat-earnings">
            <span className="stat-icon">₹</span>
            <span className="stat-number">₹{earnings[earningsView].amount}</span>
            <span className="stat-label">{t('totalEarnings')}</span>
          </div>
          <div className="stat-card stat-products">
            <span className="stat-icon">□</span>
            <span className="stat-number">{farmerProducts.length}</span>
            <span className="stat-label">{t('productsListed')}</span>
          </div>
          <div className="stat-card stat-orders">
            <span className="stat-icon">□</span>
            <span className="stat-number">{earnings[earningsView].orders}</span>
            <span className="stat-label">{t('totalOrders')}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}>{t('productsListed')}</button>
        <button className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}>{t('viewOrders')}</button>
        <button className={`tab-btn ${activeTab === 'customers' ? 'active' : ''}`}
          onClick={() => setActiveTab('customers')}>{t('repeatCustomers')}</button>
      </div>

      {activeTab === 'overview' && (
        <div className="dashboard-content">
          <div className="earnings-section">
            <h3 className="section-title">{t('earnings')}</h3>
            <div className="earnings-tabs">
              <button className={`earnings-tab ${earningsView === 'daily' ? 'active' : ''}`}
                onClick={() => setEarningsView('daily')}>{t('daily')}</button>
              <button className={`earnings-tab ${earningsView === 'weekly' ? 'active' : ''}`}
                onClick={() => setEarningsView('weekly')}>{t('weekly')}</button>
              <button className={`earnings-tab ${earningsView === 'monthly' ? 'active' : ''}`}
                onClick={() => setEarningsView('monthly')}>{t('monthly')}</button>
            </div>
            <div className="earnings-display">
              <span className="earnings-amount">₹{earnings[earningsView].amount}</span>
              <span className="earnings-orders">{earnings[earningsView].orders} {t('orders')}</span>
            </div>
            <div className="earnings-chart">
              {[65, 80, 45, 90, 70, 85, 60].map((val, idx) => (
                <div key={idx} className="chart-bar-container">
                  <div className="chart-bar" style={{ height: `${val}%` }}></div>
                  <span className="chart-label">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="quick-actions">
            <h3 className="section-title">Quick Actions</h3>
            <div className="action-grid">
              <button className="action-btn action-add" onClick={() => { setActiveTab('products'); setShowAddProduct(true); }}>
                <span className="action-icon">+</span>
                <span>{t('addProduct')}</span>
              </button>
              <button className="action-btn action-stock" onClick={() => setActiveTab('products')}>
                <span className="action-icon">☰</span>
                <span>{t('updateStock')}</span>
              </button>
              <button className="action-btn action-photo" onClick={() => quickUploadRef.current?.click()}>
                <span className="action-icon">↑</span>
                <span>{t('uploadPhotos')}</span>
              </button>
              <input
                ref={quickUploadRef}
                type="file"
                accept="image/*"
                multiple
                capture="environment"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    alert(`${files.length} photo${files.length > 1 ? 's' : ''} selected! Go to Products tab to attach them to a product.`);
                    setActiveTab('products');
                    setShowAddProduct(true);
                    // Load selected files into add-product form
                    const newImages: ProductImage[] = [];
                    Array.from(files).forEach(file => {
                      if (file.type.startsWith('image/')) {
                        newImages.push({ file, preview: URL.createObjectURL(file) });
                      }
                    });
                    setProductImages(prev => [...prev, ...newImages].slice(0, 5));
                  }
                  e.target.value = '';
                }}
              />
              <button className="action-btn action-orders" onClick={() => setActiveTab('orders')}>
                <span className="action-icon">☰</span>
                <span>{t('viewOrders')}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="dashboard-content">
          <div className="products-header">
            <h3 className="section-title">My Products</h3>
            <button className="btn-primary" onClick={() => setShowAddProduct(!showAddProduct)}>
              + {t('addProduct')}
            </button>
          </div>

          {showAddProduct && (
            <form className="add-product-form" onSubmit={handleAddProduct}>
              <div className="form-group">
                <label>{t('productName')}</label>
                <input type="text" className="form-input" value={newProduct.name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, name: e.target.value})}
                  placeholder={t('productName')} required />
              </div>
              <div className="form-group">
                <label>{t('selectCategory')}</label>
                <select className="form-input" value={newProduct.category}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="fruits">{t('fruits')}</option>
                  <option value="vegetables">{t('vegetables')}</option>
                  <option value="grains">{t('grains')}</option>
                  <option value="dairy">{t('dairy')}</option>
                  <option value="organic">{t('organic')}</option>
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>{t('pricePerKg')}</label>
                  <input type="number" className="form-input" value={newProduct.price}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, price: e.target.value})}
                    placeholder="₹" required />
                </div>
                <div className="form-group">
                  <label>{t('availableQty')}</label>
                  <input type="number" className="form-input" value={newProduct.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProduct({...newProduct, quantity: e.target.value})}
                    placeholder="kg" required />
                </div>
              </div>
              <div className="form-group">
                <label>{t('farmingMethod')}</label>
                <select className="form-input" value={newProduct.method}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewProduct({...newProduct, method: e.target.value})}>
                  <option value="Organic">Organic</option>
                  <option value="Natural">Natural</option>
                  <option value="Chemical">Chemical</option>
                </select>
              </div>
              <div className="form-group">
                <label>{t('description')}</label>
                <textarea className="form-input form-textarea" value={newProduct.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewProduct({...newProduct, description: e.target.value})}
                  placeholder={t('description')} rows={3} />
              </div>
              <div className="form-group">
                <label>{t('uploadImages')}</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImageSelect(e, 'add')}
                />
                <div
                  className="upload-area"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ cursor: 'pointer', border: '2px dashed #d1d5db', borderRadius: 12, padding: '20px 16px', textAlign: 'center', background: '#fafafa', transition: 'border-color 0.2s, background 0.2s' }}
                  onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.background = '#f0fdf4'; }}
                  onDragLeave={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.background = '#fafafa'; }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.background = '#fafafa';
                    const files = e.dataTransfer.files;
                    const newImages: ProductImage[] = [];
                    Array.from(files).forEach(file => {
                      if (file.type.startsWith('image/')) {
                        newImages.push({ file, preview: URL.createObjectURL(file) });
                      }
                    });
                    setProductImages(prev => [...prev, ...newImages].slice(0, 5));
                  }}
                >
                  <span style={{ fontSize: 32, display: 'block', marginBottom: 4 }}>📷</span>
                  <p style={{ margin: '4px 0 2px', fontWeight: 600, color: '#16a34a', fontSize: 14 }}>Tap to upload photos</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#888' }}>Choose from gallery, camera, or drag & drop (max 5)</p>
                </div>
                {/* Image Previews */}
                {productImages.length > 0 && (
                  <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                    {productImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', width: 72, height: 72, borderRadius: 10, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                        <img src={img.preview} alt={`Upload ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(idx, 'add'); }}
                          style={{
                            position: 'absolute', top: 2, right: 2,
                            width: 20, height: 20, borderRadius: '50%',
                            background: 'rgba(220,38,38,0.85)', color: '#fff',
                            border: 'none', fontSize: 12, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            lineHeight: 1,
                          }}
                        >×</button>
                      </div>
                    ))}
                    {productImages.length < 5 && (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                          width: 72, height: 72, borderRadius: 10,
                          border: '2px dashed #d1d5db', cursor: 'pointer',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 24, color: '#aaa', background: '#fafafa',
                        }}
                      >+</div>
                    )}
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-success">{t('save')}</button>
                <button type="button" className="btn-secondary" onClick={() => setShowAddProduct(false)}>
                  {t('cancel')}
                </button>
              </div>
            </form>
          )}

          <input
            ref={editFileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            style={{ display: 'none' }}
            onChange={(e) => handleImageSelect(e, 'edit')}
          />

          <div className="dashboard-product-list">
            {farmerProducts.map(p => (
              <div key={p.id} className="dashboard-product-item">
                <img src={p.image} alt={p.name} className="dp-image"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80x60?text=Product'; }} />
                <div className="dp-info">
                  <h4>{p.name}</h4>
                  <p>₹{p.price}/{p.unit} • {p.availableQty > 0
                    ? <span>{p.availableQty} {t('available')}</span>
                    : <span style={{ color: '#dc2626', fontWeight: 600 }}>Sold Out</span>
                  }</p>
                </div>
                <div className="dp-actions">
                  <button className="dp-btn dp-edit" title={t('edit')}
                    onClick={() => {
                      if (editingProductId === p.id) {
                        setEditingProductId(null);
                        editImages.forEach(img => URL.revokeObjectURL(img.preview));
                        setEditImages([]);
                      } else {
                        setEditingProductId(p.id);
                        setEditForm({
                          name: p.name,
                          price: String(p.price),
                          quantity: String(p.availableQty),
                          description: p.description,
                          method: p.farmingMethod,
                        });
                        setEditImages([]);
                      }
                    }}
                  >{editingProductId === p.id ? 'Close' : 'Edit'}</button>
                  <button className="dp-btn dp-sold" title={t('markSoldOut')}
                    onClick={() => {
                      updateProductInStore(p.id, { availableQty: 0 });
                    }}
                    style={p.availableQty === 0 ? { opacity: 0.5 } : {}}
                  >{p.availableQty === 0 ? '✓' : '—'}</button>
                  <button className="dp-btn dp-delete" title={t('delete')}
                    onClick={() => {
                      if (window.confirm(`Delete "${p.name}"? This cannot be undone.`)) {
                        removeProduct(p.id);
                        if (editingProductId === p.id) {
                          editImages.forEach(img => URL.revokeObjectURL(img.preview));
                          setEditImages([]);
                          setEditingProductId(null);
                        }
                      }
                    }}
                  >×</button>
                </div>

                {/* Full inline edit panel */}
                {editingProductId === p.id && (
                  <div style={{
                    width: '100%', marginTop: 12, padding: 16,
                    background: '#f9fafb', borderRadius: 12,
                    border: '1px solid #e5e7eb',
                  }}>
                    <p style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#16a34a' }}>
                      ✏️ Editing: {p.name}
                    </p>

                    {/* Product Name */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Product Name</label>
                      <input type="text" value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Price & Quantity */}
                    <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Price (₹/{p.unit})</label>
                        <input type="number" value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Stock ({p.unit})</label>
                        <input type="number" value={editForm.quantity}
                          onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                        />
                      </div>
                    </div>

                    {/* Farming Method */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Farming Method</label>
                      <select value={editForm.method}
                        onChange={(e) => setEditForm(prev => ({ ...prev, method: e.target.value }))}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, boxSizing: 'border-box' }}
                      >
                        <option value="Organic">Organic</option>
                        <option value="Natural">Natural</option>
                        <option value="Chemical">Chemical</option>
                      </select>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Description</label>
                      <textarea value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={2}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1.5px solid #d1d5db', fontSize: 14, resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </div>

                    {/* Current image */}
                    <div style={{ marginBottom: 10 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 4 }}>Product Image</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 64, height: 64, borderRadius: 8, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                          <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <span style={{ fontSize: 12, color: '#888' }}>Current</span>
                      </div>
                    </div>

                    {/* Upload new images */}
                    <div
                      onClick={() => editFileInputRef.current?.click()}
                      style={{
                        cursor: 'pointer', border: '2px dashed #d1d5db', borderRadius: 10,
                        padding: '12px 10px', textAlign: 'center', background: '#fff',
                        transition: 'border-color 0.2s', marginBottom: 8,
                      }}
                    >
                      <span style={{ fontSize: 22 }}>📷</span>
                      <p style={{ margin: '2px 0 0', fontWeight: 600, color: '#16a34a', fontSize: 13 }}>
                        Upload new photo (optional)
                      </p>
                    </div>

                    {/* New image previews */}
                    {editImages.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        {editImages.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative', width: 56, height: 56, borderRadius: 8, overflow: 'hidden', border: '2px solid #16a34a' }}>
                            <img src={img.preview} alt={`New ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button type="button" onClick={() => removeImage(idx, 'edit')}
                              style={{ position: 'absolute', top: 1, right: 1, width: 16, height: 16, borderRadius: '50%', background: 'rgba(220,38,38,0.85)', color: '#fff', border: 'none', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Save / Cancel */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => {
                          const updates: Partial<typeof p> = {
                            name: editForm.name.trim() || p.name,
                            price: Number(editForm.price) || p.price,
                            availableQty: Number(editForm.quantity) >= 0 ? Number(editForm.quantity) : p.availableQty,
                            description: editForm.description || p.description,
                            farmingMethod: editForm.method,
                          };
                          if (editImages.length > 0) {
                            updates.image = editImages[0].preview;
                            updates.images = editImages.map(img => img.preview);
                          }
                          updateProductInStore(p.id, updates);
                          setEditImages([]);
                          setEditingProductId(null);
                        }}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 8, border: 'none',
                          background: '#16a34a', color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                        }}
                      >💾 Save Changes</button>
                      <button
                        onClick={() => {
                          editImages.forEach(img => URL.revokeObjectURL(img.preview));
                          setEditImages([]);
                          setEditingProductId(null);
                        }}
                        style={{
                          flex: 1, padding: '10px', borderRadius: 8,
                          border: '1.5px solid #e5e7eb', background: '#fff',
                          color: '#333', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                        }}
                      >{t('cancel')}</button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="dashboard-content">
          <h3 className="section-title">{t('viewOrders')}</h3>
          <div className="dashboard-orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="dashboard-order-item">
                <div className="do-header">
                  <span className="do-id">{order.id}</span>
                  <span className={`do-status status-${order.status}`}>{order.status}</span>
                </div>
                <div className="do-body">
                  <p><strong>{order.customer}</strong></p>
                  <p>{order.items}</p>
                  <p className="do-total">₹{order.total}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'customers' && (
        <div className="dashboard-content">
          <h3 className="section-title">{t('repeatCustomers')} (QR Based)</h3>
          <div className="customers-list">
            {repeatCustomers.map((customer, idx) => (
              <div key={idx} className="customer-card">
                <div className="customer-info">
                  <span className="customer-avatar">—</span>
                  <div>
                    <h4>{customer.name}</h4>
                    <p>{customer.orders} orders • Last: {customer.lastOrder}</p>
                    <p>{customer.phone}</p>
                  </div>
                </div>
                <button className="btn-whatsapp-sm" onClick={() =>
                  window.open(`https://wa.me/${customer.phone.replace(/\s/g, '')}`, '_blank')
                }>
                  Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
