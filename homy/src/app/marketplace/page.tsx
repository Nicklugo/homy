'use client';

import React from 'react';
import ProductComparison from '../components/ProductComparison';
import ProductRecommendation from '../components/ProductRecommendation';

const MarketplacePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Smart Product Recommendations</h1>
      
      {/* AI-Powered Product Comparison */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Compare Top Products</h2>
        <ProductComparison />
      </section>

      {/* Personalized Recommendations */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Recommended for Your Home</h2>
        <ProductRecommendation />
      </section>
    </div>
  );
};

export default MarketplacePage; 