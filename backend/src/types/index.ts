export interface SearchQuery {
  country: string;
  query: string;
}

export interface ProductResult {
  link: string;
  price: number | string;
  currency: string;
  productName: string;
  website: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  availability?: string;
}

export interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  websites: string[];
} 