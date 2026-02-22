import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../data/mockData';

interface CategoryBarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryBar: React.FC<CategoryBarProps> = ({ selectedCategory, setSelectedCategory }) => {
  const { t } = useLanguage();

  return (
    <div className="category-section">
      <h2 className="section-title">{t('categories')}</h2>
      <div className="category-bar">
        <button
          className={`category-item ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <span className="category-emoji"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/></svg></span>
          <span className="category-label">{t('allProducts')}</span>
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
            style={{ '--cat-color': cat.color } as React.CSSProperties}
          >
            <span className="category-emoji">{cat.emoji}</span>
            <span className="category-label">{t(cat.id)}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
