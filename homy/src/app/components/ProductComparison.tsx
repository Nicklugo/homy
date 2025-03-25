'use client';

import React, { useState, useEffect } from 'react';
import { Product, ProductCategory } from '../../types/product';
import { RecommendationEngine } from '../../services/recommendationEngine';
import { Analytics } from '../../services/analytics';

const ProductComparison = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('vacuum');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const engine = new RecommendationEngine();

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const recommendations = await engine.getRecommendations({
        homeSize: 2000,
        floorTypes: ['hardwood', 'carpet'],
        hasPets: true,
        cleaningFrequency: 'weekly'
      }, selectedCategory);
      setProducts(recommendations);
      setLoading(false);
    };

    loadProducts();
  }, [selectedCategory]);

  return (
    <div className="enhanced-card p-6 fade-in">
      <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
        {(['vacuum', 'cleaning', 'organization', 'tools'] as ProductCategory[]).map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              gradient-btn whitespace-nowrap px-4 py-2 rounded-md transition-all
              ${selectedCategory === category 
                ? 'bg-navy-600 text-white shadow-lg' 
                : 'bg-gray-100 hover:bg-gray-200 text-navy-600'
              }
            `}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const [comparison, setComparison] = useState<{
    pros: string[];
    cons: string[];
    verdict: string;
  } | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const engine = new RecommendationEngine();

  useEffect(() => {
    const loadComparison = async () => {
      const result = await engine.getProductComparison([product]);
      setComparison(result);
    };
    loadComparison();
  }, [product]);

  const handleAffiliateClick = () => {
    Analytics.trackAffiliateClick(product);
  };

  return (
    <div 
      className="glass-card p-4 fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative overflow-hidden rounded-lg mb-4">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className={`
            w-full h-48 object-contain transition-transform duration-300
            ${isHovered ? 'scale-105' : 'scale-100'}
          `}
        />
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-navy-100 text-navy-800">
            {product.category}
          </span>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold mb-2 text-navy-900">{product.name}</h3>
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl font-bold text-navy-600">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex items-center">
          <div className="flex text-yellow-400">
            {'★'.repeat(Math.round(product.rating))}
          </div>
          <span className="text-sm text-gray-500 ml-1">
            ({product.reviews.toLocaleString()})
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {product.bestFor.map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-navy-50 text-navy-600 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>

        {comparison && (
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">{comparison.verdict}</p>
          </div>
        )}

        <a
          href={product.affiliateLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleAffiliateClick}
          className="gradient-btn block w-full text-center py-2 mt-4"
        >
          View Best Price
        </a>
      </div>
    </div>
  );
};

export default ProductComparison; 