import axios from 'axios';
import { ProductResult } from '../types';
import { extractPrice, extractCurrency, mapCurrencySymbolToCode, cleanProductName } from '../utils/helpers';
import logger from '../utils/logger';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

// Define SerpApi configuration
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY || '';
const SERPAPI_BASE_URL = 'https://serpapi.com/search';

/**
 * Get products from SerpApi for a specific website
 * @param website - Website name (amazon, walmart, etc.)
 * @param countryCode - Country code
 * @param query - Search query
 * @returns Promise<ProductResult[]> - Array of product results
 */
export const getProductsFromSerpApi = async (
  website: string,
  countryCode: string,
  query: string
): Promise<ProductResult[]> => {
  try {
    // Check if API key is available
    if (!SERPAPI_API_KEY) {
      logger.error("Cannot fetch products: SERPAPI_API_KEY is missing");
      return [];
    }

    // Map website name to SerpApi engine
    const engineMap: Record<string, string> = {
      'amazon': 'amazon_search',
      'walmart': 'walmart_search',
      'bestbuy': 'google_shopping',
      'target': 'google_shopping',
      'newegg': 'google_shopping'
    };

    // Default to google_shopping if website is not directly supported
    const engine = engineMap[website.toLowerCase()] || 'google_shopping';
    
    logger.info(`Fetching data from SerpApi for ${website} with query: ${query}`);

    // Prepare search parameters based on engine
    let params: Record<string, string> = {
      api_key: SERPAPI_API_KEY,
      engine: engine
    };

    // Add engine-specific parameters
    if (engine === 'amazon_search') {
      params.q = query;
      params.amazon_domain = `amazon.${countryCode.toLowerCase() === 'us' ? 'com' : countryCode.toLowerCase()}`;
    } else if (engine === 'walmart_search') {
      params.query = query;
    } else if (engine === 'google_shopping') {
      params.q = query;
      params.google_domain = `google.${countryCode.toLowerCase() === 'us' ? 'com' : countryCode.toLowerCase()}`;
      // Add site restriction for specific retailers in Google Shopping
      if (website.toLowerCase() !== 'bestbuy' && website.toLowerCase() !== 'target') {
        params.q += ` site:${website.toLowerCase()}.com`;
      }
    }

    logger.info(`SerpApi request: ${SERPAPI_BASE_URL} with params: ${JSON.stringify(params)}`);

    // Make API request to SerpApi
    const response = await axios.get(SERPAPI_BASE_URL, { params });
    
    if (!response.data) {
      logger.warn(`No data returned from SerpApi for ${website}`);
      return [];
    }

    // Process results based on the engine
    let products: ProductResult[] = [];
    
    if (engine === 'amazon_search') {
      products = processAmazonResults(response.data, website);
    } else if (engine === 'walmart_search') {
      products = processWalmartResults(response.data, website);
    } else if (engine === 'google_shopping') {
      products = processGoogleShoppingResults(response.data, website);
    }

    logger.info(`Extracted ${products.length} products from SerpApi for ${website}`);
    return products;
  } catch (error: any) {
    logger.error(`Error fetching data from SerpApi for ${website}: ${error.message}`);
    if (error.response) {
      logger.error(`Response status: ${error.response.status}`);
      logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
    }
    return [];
  }
};

/**
 * Process Amazon search results from SerpApi
 * @param data - SerpApi response data
 * @param website - Website name
 * @returns ProductResult[] - Array of product results
 */
const processAmazonResults = (data: any, website: string): ProductResult[] => {
  const products: ProductResult[] = [];
  const seenItems = new Set<string>(); // Track seen items by title+price
  
  // Process shopping results
  if (data.shopping_results && Array.isArray(data.shopping_results)) {
    data.shopping_results.slice(0, 10).forEach((item: any) => {
      if (!item.title) return;
      
      const price = typeof item.price === 'number' ? 
        item.price : 
        extractPrice(String(item.price || '0'));
      
      // Create a unique key for this product
      const key = `${item.title}-${price}`;
      
      // Skip if we've seen this product already
      if (seenItems.has(key)) return;
      seenItems.add(key);
      
      products.push({
        link: item.link || '',
        price,
        currency: item.price?.currency || 'USD',
        productName: cleanProductName(item.title),
        website,
        imageUrl: item.thumbnail || '',
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        availability: item.availability || 'In Stock'
      });
    });
  }
  
  // Process organic results as fallback
  if (products.length === 0 && data.organic_results && Array.isArray(data.organic_results)) {
    data.organic_results.slice(0, 10).forEach((item: any) => {
      if (!item.title) return;
      
      const price = typeof item.price === 'number' ? 
        item.price : 
        extractPrice(String(item.price || '0'));
      
      // Create a unique key for this product
      const key = `${item.title}-${price}`;
      
      // Skip if we've seen this product already
      if (seenItems.has(key)) return;
      seenItems.add(key);
      
      products.push({
        link: item.link || '',
        price,
        currency: 'USD', // Default for organic results
        productName: cleanProductName(item.title),
        website,
        imageUrl: item.thumbnail || '',
        rating: 0,
        reviews: 0,
        availability: 'In Stock'
      });
    });
  }
  
  return products;
};

/**
 * Process Walmart search results from SerpApi
 * @param data - SerpApi response data
 * @param website - Website name
 * @returns ProductResult[] - Array of product results
 */
const processWalmartResults = (data: any, website: string): ProductResult[] => {
  const products: ProductResult[] = [];
  const seenItems = new Set<string>(); // Track seen items by title+price
  
  // Process organic results
  if (data.organic_results && Array.isArray(data.organic_results)) {
    data.organic_results.slice(0, 10).forEach((item: any) => {
      if (!item.title) return;
      
      // Extract price from different possible formats
      let price = 0;
      if (item.primary_offer && item.primary_offer.offer_price) {
        price = item.primary_offer.offer_price;
      } else if (item.price) {
        price = typeof item.price === 'number' ? 
          item.price : 
          extractPrice(String(item.price));
      }
      
      // Create a unique key for this product
      const key = `${item.title}-${price}`;
      
      // Skip if we've seen this product already
      if (seenItems.has(key)) return;
      seenItems.add(key);
      
      products.push({
        link: item.product_page_url || item.link || '',
        price,
        currency: (item.primary_offer && item.primary_offer.currency) || 'USD',
        productName: cleanProductName(item.title),
        website,
        imageUrl: item.thumbnail || '',
        rating: item.rating || 0,
        reviews: item.reviews_count || 0,
        availability: item.availability_status || 'In Stock'
      });
    });
  }
  
  return products;
};

/**
 * Process Google Shopping results from SerpApi
 * @param data - SerpApi response data
 * @param website - Website name
 * @returns ProductResult[] - Array of product results
 */
const processGoogleShoppingResults = (data: any, website: string): ProductResult[] => {
  const products: ProductResult[] = [];
  const seenItems = new Set<string>(); // Track seen items by title+price
  
  // Process shopping results
  if (data.shopping_results && Array.isArray(data.shopping_results)) {
    data.shopping_results.slice(0, 10).forEach((item: any) => {
      if (!item.title) return;
      
      // For specific websites, filter by source
      if (website.toLowerCase() !== 'bestbuy' && 
          website.toLowerCase() !== 'target' && 
          item.source && 
          !item.source.toLowerCase().includes(website.toLowerCase())) {
        return;
      }
      
      // Extract price from string (e.g., "$599.99")
      const price = item.price ? extractPrice(String(item.price)) : 0;
      
      // Create a unique key for this product
      const key = `${item.title}-${price}-${item.source || website}`;
      
      // Skip if we've seen this product already
      if (seenItems.has(key)) return;
      seenItems.add(key);
      
      products.push({
        link: item.link || '',
        price,
        currency: extractCurrency(String(item.price || '')) ? 
          mapCurrencySymbolToCode(extractCurrency(String(item.price || ''))) : 
          'USD',
        productName: cleanProductName(item.title),
        website: item.source || website,
        imageUrl: item.thumbnail || '',
        rating: item.rating || 0,
        reviews: item.reviews || 0,
        availability: 'In Stock' // Google Shopping typically only shows in-stock items
      });
    });
  }
  
  return products;
};

/**
 * Scrape products from multiple websites using SerpApi
 * @param query - Search query
 * @param websites - Array of websites to scrape
 * @param countryCode - Country code
 * @returns Promise<ProductResult[]> - Array of product results
 */
export const scrapeMultipleWebsites = async (
  query: string,
  websites: string[],
  countryCode: string = 'US'
): Promise<ProductResult[]> => {
  try {
    logger.info(`Searching for "${query}" across websites: ${websites.join(', ')} in ${countryCode}`);
    
    const allResults: ProductResult[] = [];
    
    // Process websites one by one
    for (const website of websites) {
      try {
        const results = await getProductsFromSerpApi(website, countryCode, query);
        allResults.push(...results);
        
        // If we have enough results, we can stop
        if (allResults.length >= 20) {
          logger.info(`Found ${allResults.length} products, stopping further searches`);
          break;
        }
      } catch (error) {
        logger.error(`Error getting products for ${website}: ${error}`);
        // Continue with next website
      }
    }
    
    // If no results from SerpApi, try fallback to Google Shopping generic search
    if (allResults.length === 0) {
      try {
        logger.info(`No results from specific websites, trying generic Google Shopping search`);
        const params = {
          api_key: SERPAPI_API_KEY,
          engine: 'google_shopping',
          q: query,
          google_domain: `google.${countryCode.toLowerCase() === 'us' ? 'com' : countryCode.toLowerCase()}`
        };
        
        const response = await axios.get(SERPAPI_BASE_URL, { params });
        
        if (response.data && response.data.shopping_results) {
          response.data.shopping_results.slice(0, 10).forEach((item: any) => {
            if (!item.title) return;
            
            const price = extractPrice(String(item.price || '0'));
            
            allResults.push({
              link: item.link || '',
              price,
              currency: extractCurrency(String(item.price || '')) ? 
                mapCurrencySymbolToCode(extractCurrency(String(item.price || ''))) : 
                'USD',
              productName: cleanProductName(item.title),
              website: item.source || 'Google Shopping',
              imageUrl: item.thumbnail || '',
              rating: item.rating || 0,
              reviews: item.reviews || 0,
              availability: 'In Stock'
            });
          });
          
          logger.info(`Found ${allResults.length} products from generic Google Shopping search`);
        }
      } catch (error) {
        logger.error(`Error in fallback Google Shopping search: ${error}`);
      }
    }
    
    return allResults;
  } catch (error) {
    logger.error(`Error in scrapeMultipleWebsites: ${error}`);
    return [];
  }
}; 