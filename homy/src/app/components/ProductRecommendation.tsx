'use client';

import React, { useState, useEffect } from 'react';
import { Product } from '../../types/product';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { Analytics } from '../../services/analytics';

const ProductRecommendation = () => {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const engine = new RecommendationEngine();

  useEffect(() => {
    const loadRecommendations = async () => {
      setLoading(true);
      const products = await engine.getRecommendations({
        homeSize: 2000,
        floorTypes: ['hardwood', 'carpet'],
        hasPets: true,
        cleaningFrequency: 'weekly'
      });
      setRecommendations(products.slice(0, 4));
      setLoading(false);
    };

    loadRecommendations();
  }, []);

  const handleAffiliateClick = (product: Product) => {
    Analytics.trackAffiliateClick(product);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {recommendations.map(product => (
        <div key={product.id} className="bg-white rounded-lg shadow-lg p-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-contain mb-4"
          />
          <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold">${product.price}</span>
            <div className="flex items-center text-yellow-500">
              {'★'.repeat(Math.round(product.rating))}
              <span className="text-gray-500 text-sm ml-1">({product.reviews})</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">{product.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {product.bestFor.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-navy-100 text-navy-600 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
          <a
            href={product.affiliateLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleAffiliateClick(product)}
            className="block w-full text-center bg-navy-600 text-white py-2 rounded-md hover:bg-navy-700 transition-colors"
          >
            View Best Price
          </a>
        </div>
      ))}
    </div>
  );
};

export default ProductRecommendation; 