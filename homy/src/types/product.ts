export interface Product {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  category: string;
  affiliateLink: string;
  features: string[];
  imageUrl: string;
  brand: string;
  bestFor: string[];
}

export type ProductCategory = 'vacuum' | 'cleaning' | 'organization' | 'tools'; 