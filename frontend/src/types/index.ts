export interface SearchQuery {
  country: string;
  query: string;
}

export interface Product {
  link: string;
  price: number;
  currency: string;
  productName: string;
  website: string;
  imageUrl?: string;
  description?: string;
  rating?: number;
  reviews?: number;
  availability?: string;
  message?: string;
}

export interface Country {
  code: string;
  name: string;
  currency: string;
  websites: string[];
}

export interface CountryMap {
  [key: string]: Country;
}

export interface CountryInfo {
  code: string;
  name: string;
  currency: string;
  websites: string[];
} 