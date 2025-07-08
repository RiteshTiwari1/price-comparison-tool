import { Request, Response } from 'express';
import { searchProducts } from '../services/productService';
import { countries } from '../config/websites';
import logger from '../utils/logger';

/**
 * Search for products
 * @route POST /api/products/search
 * @access Public
 */
export const searchProductsController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { country, query } = req.body;
    
    // Validate input
    if (!country || !query) {
      res.status(400).json({ message: 'Country and query are required' });
      return;
    }
    
    logger.info(`Received search request for "${query}" in ${country}`);
    
    // Search for products with updated function signature (query, country)
    const products = await searchProducts(query, country);
    
    logger.info(`Returning ${products.length} products for "${query}" in ${country}`);
    res.status(200).json(products);
  } catch (error) {
    logger.error(`Error in searchProductsController: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
};

/**
 * Get supported countries
 * @route GET /api/products/countries
 * @access Public
 */
export const getSupportedCountriesController = (_req: Request, res: Response): void => {
  try {
    res.status(200).json(countries);
  } catch (error) {
    logger.error(`Error in getSupportedCountriesController: ${error instanceof Error ? error.message : String(error)}`);
    res.status(500).json({ message: 'Server error', error: error instanceof Error ? error.message : String(error) });
  }
}; 