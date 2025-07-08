import { ProductResult } from '../types';

/**
 * Extract price from price text
 * @param priceText - Price text
 * @returns number - Extracted price
 */
export const extractPrice = (priceText: string): number => {
  // Remove currency symbols and other non-numeric characters
  const numericString = priceText.replace(/[^0-9.,]/g, '');
  
  // Replace comma with dot for decimal point
  const formattedString = numericString.replace(/,/g, '.');
  
  // Extract the first valid number
  const match = formattedString.match(/\d+(\.\d+)?/);
  
  if (match) {
    return parseFloat(match[0]);
  }
  
  return 0;
};

/**
 * Extract currency symbol from price text
 * @param priceText - Price text
 * @returns string - Extracted currency symbol
 */
export const extractCurrency = (priceText: string): string => {
  // Common currency symbols
  const currencySymbols = ['$', '€', '£', '¥', '₹', 'CA$', 'A$'];
  
  for (const symbol of currencySymbols) {
    if (priceText.includes(symbol)) {
      return symbol;
    }
  }
  
  return '';
};

/**
 * Map currency symbol to currency code
 * @param symbol - Currency symbol
 * @returns string - Currency code
 */
export const mapCurrencySymbolToCode = (symbol: string): string => {
  const map: { [key: string]: string } = {
    '$': 'USD',
    '€': 'EUR',
    '£': 'GBP',
    '¥': 'JPY',
    '₹': 'INR',
    'CA$': 'CAD',
    'A$': 'AUD'
  };
  
  return map[symbol] || 'USD';
};

/**
 * Map country code to currency code
 * @param countryCode - The country code
 * @returns string - The default currency code for the country
 */
export const mapCountryToCurrency = (countryCode: string): string => {
  const countryToCurrency: { [key: string]: string } = {
    'US': 'USD',
    'GB': 'GBP',
    'UK': 'GBP',
    'EU': 'EUR',
    'DE': 'EUR',
    'FR': 'EUR',
    'IT': 'EUR',
    'ES': 'EUR',
    'JP': 'JPY',
    'CN': 'CNY',
    'IN': 'INR',
    'CA': 'CAD',
    'AU': 'AUD',
    'BR': 'BRL',
    'RU': 'RUB',
    'KR': 'KRW',
    'ZA': 'ZAR',
    'MX': 'MXN',
    'SG': 'SGD',
    'AE': 'AED',
    'SA': 'SAR'
  };

  return countryToCurrency[countryCode.toUpperCase()] || 'USD';
};

/**
 * Clean product name
 * @param name - Product name
 * @returns string - Cleaned product name
 */
export const cleanProductName = (name: string): string => {
  // Remove extra whitespace
  let cleanedName = name.replace(/\s+/g, ' ').trim();
  
  // Remove common prefixes and suffixes
  cleanedName = cleanedName
    .replace(/^(buy|get|shop|new|hot|sale|best|top|premium|official)\s+/i, '')
    .replace(/\s+(sale|discount|deal|clearance|online|only|now|today|exclusive)$/i, '');
  
  return cleanedName;
};

/**
 * Sort products by price (ascending)
 * @param products - Array of products
 * @returns ProductResult[] - Sorted products
 */
export const sortProductsByPrice = (products: ProductResult[]): ProductResult[] => {
  return [...products].sort((a, b) => {
    // Convert prices to numbers if they are strings
    const priceA = typeof a.price === 'string' ? parseFloat(a.price) : a.price;
    const priceB = typeof b.price === 'string' ? parseFloat(b.price) : b.price;
    
    return priceA - priceB;
  });
};

/**
 * Extract domain from URL
 * @param url - URL
 * @returns string - Extracted domain
 */
export const extractDomain = (url: string): string => {
  try {
    const hostname = new URL(url).hostname;
    const parts = hostname.split('.');
    
    if (parts.length >= 2) {
      return parts[parts.length - 2];
    }
    
    return hostname;
  } catch (error) {
    return '';
  }
};

/**
 * Normalize query string for better matching
 * @param query - The query to normalize
 * @returns string - The normalized query
 */
export const normalizeQuery = (query: string): string => {
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}; 