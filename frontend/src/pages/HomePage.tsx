import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  CircularProgress,
  Divider,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import SearchIcon from '@mui/icons-material/Search';
import { searchProducts } from '../services/api';
import { Product } from '../types';
import CountryDropdown from '../components/CountryDropdown';

const HomePage = () => {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('US');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setProducts([]);
      
      const results = await searchProducts({ query, country });
      
      // Check if we got an error response
      if (Array.isArray(results) && results.length === 1 && 'message' in results[0]) {
        setError(results[0].message as string);
        setProducts([]);
        return;
      }
      
      setProducts(results);
      
      if (results.length === 0) {
        setError(`No products found for "${query}". Please try a different search query or select another country.`);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      setError('Failed to fetch product data. Please check your internet connection and try again. If the problem persists, the backend API key may be missing or invalid.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value: string) => {
    setCountry(value);
  };

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Price Comparison Tool
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Find the best prices across multiple websites
        </Typography>
      </Box>

      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 800,
          borderRadius: 2,
        }}
      >
        <form onSubmit={handleSearch}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label="Search for a product"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., iPhone 16 Pro, 128GB"
              required
              sx={{ flex: 2 }}
              disabled={loading}
            />
            
            <Box sx={{ flex: 1 }}>
              <CountryDropdown 
                value={country} 
                onChange={handleCountryChange}
                disabled={loading}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ height: '56px', flex: 0.5 }}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Box>
        </form>
      </Paper>

      {error && (
        <Alert 
          severity="info" 
          sx={{ width: '100%', maxWidth: 800 }}
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 4 }}>
          <CircularProgress />
          <Typography variant="body2" sx={{ mt: 2 }}>
            Searching for the best prices across multiple websites...
          </Typography>
        </Box>
      ) : products.length > 0 ? (
        <Box sx={{ width: '100%' }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Search Results for "{query}" in {country}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Found {products.length} results sorted by price (lowest first)
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {products.map((product, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`${product.link}-${index}`}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: 4,
                    },
                  }}
                >
                  {product.imageUrl && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.imageUrl}
                      alt={product.productName}
                      sx={{ objectFit: 'contain', p: 1 }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/140x140?text=No+Image';
                      }}
                    />
                  )}
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom noWrap>
                      {product.productName}
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom>
                      {formatPrice(product.price, product.currency)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {product.website}
                    </Typography>
                    {product.rating !== undefined && product.rating > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating} precision={0.5} readOnly size="small" />
                        {product.reviews !== undefined && product.reviews > 0 && (
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({product.reviews})
                          </Typography>
                        )}
                      </Box>
                    )}
                    {product.availability && (
                      <Chip 
                        label={product.availability} 
                        size="small" 
                        color={product.availability.toLowerCase().includes('in stock') ? 'success' : 'default'}
                        sx={{ mb: 1 }}
                      />
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : null}
    </Box>
  );
};

export default HomePage; 