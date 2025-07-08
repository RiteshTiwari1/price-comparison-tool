import express from 'express';
import {
  searchProductsController,
  getSupportedCountriesController
} from '../controllers/productController';

const router = express.Router();

// POST /api/products/search - Search for products
router.post('/search', searchProductsController);

// GET /api/products/countries - Get supported countries
router.get('/countries', getSupportedCountriesController);

export default router; 