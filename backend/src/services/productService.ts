import { ProductResult } from '../types/index';
import { getWebsitesForCountry } from '../config/websites';
import { scrapeMultipleWebsites } from './scraperService';
import { sortProductsByPrice } from '../utils/helpers';
import logger from '../utils/logger';

/**
 * Remove duplicate products from results
 * @param products - Array of product results
 * @returns ProductResult[] - Array of unique product results
 */
const removeDuplicates = (products: ProductResult[]): ProductResult[] => {
  const uniqueProducts = new Map<string, ProductResult>();
  
  products.forEach(product => {
    // Create a key based on product name, price, and website
    const key = `${product.productName}-${product.price}-${product.website}`;
    
    // Only add if this key doesn't exist yet
    if (!uniqueProducts.has(key)) {
      uniqueProducts.set(key, product);
    }
  });
  
  return Array.from(uniqueProducts.values());
};

/**
 * Search for products across multiple websites
 * @param query - Search query
 * @param countryCode - Country code (e.g., 'US', 'UK')
 * @returns Promise<ProductResult[]> - Array of product results
 */
export const searchProducts = async (
  query: string,
  countryCode: string = 'US'
): Promise<ProductResult[]> => {
  try {
    logger.info(`Searching for "${query}" in ${countryCode}`);
    
    // Check if SERPAPI_API_KEY is available
    if (!process.env.SERPAPI_API_KEY) {
      logger.error("SERPAPI_API_KEY is missing. Cannot perform search.");
      return [{ 
        message: "API key is missing. Please set the SERPAPI_API_KEY in the backend .env file.",
        link: "", 
        price: 0, 
        currency: "", 
        productName: "Error", 
        website: "" 
      } as unknown as ProductResult];
    }
    
    // Get websites for the specified country
    const websites = getWebsitesForCountry(countryCode);
    
    if (!websites || websites.length === 0) {
      logger.warn(`No websites configured for country code: ${countryCode}`);
      return [];
    }
    // Scrape products from multiple websites
    const products = await scrapeMultipleWebsites(query, websites, countryCode);
    
    logger.info(`Found ${products.length} products for "${query}" in ${countryCode}`);
    
    // Remove duplicates
    const uniqueProducts = removeDuplicates(products);
    logger.info(`After removing duplicates: ${uniqueProducts.length} unique products`);
    
    // Sort products by price
    const sortedProducts = sortProductsByPrice(uniqueProducts);
    
    return sortedProducts;
  } catch (error) {
    logger.error(`Error searching for products: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
};

/**
 * Get product details from a specific URL
 * @param url - Product URL
 * @returns Promise<ProductResult | null> - Product details or null if not found
 */
export const getProductDetails = async (url: string): Promise<ProductResult | null> => {
  try {
    logger.info(`Getting product details from ${url}`);
    
    // This would need to be implemented with direct scraping
    // Currently returning null as we've removed database functionality
    return null;
  } catch (error) {
    logger.error(`Error getting product details: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}; 