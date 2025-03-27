'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types/product';
import recommendationEngine from '../../services/engineInstance';

const ProductComparison = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const recommendations = await recommendationEngine.getRecommendations({
          homeSize: 2000,
          floorTypes: ['hardwood', 'carpet'],
          hasPets: true,
          cleaningFrequency: 'weekly'
        });
        setProducts(recommendations);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product: Product) => (
          <div key={product.id} className="p-4 border rounded">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-2 mt-4 bg-blue-500 text-white rounded"
            >
              View Best Price
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductComparison; 