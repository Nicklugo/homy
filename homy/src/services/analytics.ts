export class Analytics {
  static trackAffiliateClick(product: {
    id: string;
    name: string;
    price: number;
    affiliateLink: string;
  }) {
    // Implementation will depend on your analytics provider
    console.log('Tracking affiliate click:', {
      event: 'affiliate_click',
      product_id: product.id,
      product_name: product.name,
      product_price: product.price,
      affiliate_link: product.affiliateLink,
      timestamp: new Date().toISOString(),
    });
  }

  static trackProductImpression(product: {
    id: string;
    name: string;
    category: string;
  }) {
    console.log('Tracking product impression:', {
      event: 'product_impression',
      product_id: product.id,
      product_name: product.name,
      product_category: product.category,
      timestamp: new Date().toISOString(),
    });
  }

  static trackSearch(query: string) {
    console.log('Tracking search:', {
      event: 'product_search',
      search_query: query,
      timestamp: new Date().toISOString(),
    });
  }
} 