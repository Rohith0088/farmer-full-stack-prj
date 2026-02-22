import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product } from '../types';
import { products as initialProducts } from '../data/mockData';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount'>) => Product;
  removeProduct: (id: number | string) => void;
  updateProduct: (id: number | string, updates: Partial<Product>) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

let nextId = initialProducts.length + 100; // Start well above existing IDs

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'rating' | 'reviewCount'>): Product => {
    const newProduct: Product = {
      ...product,
      id: nextId++,
      rating: 0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]); // New products appear first
    return newProduct;
  }, []);

  const removeProduct = useCallback((id: number | string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const updateProduct = useCallback((id: number | string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  return (
    <ProductContext.Provider value={{ products, addProduct, removeProduct, updateProduct }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = (): ProductContextType => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error('useProducts must be used within a ProductProvider');
  return ctx;
};
