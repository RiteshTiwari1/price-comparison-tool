import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Chip,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { searchProducts } from '../services/api';
import { Product, CountryMap } from '../types';
import CountryDropdown from '../components/CountryDropdown';

interface LocationState {
  query: string;
  country: string;
}

const SearchResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  
  const [query, setQuery] = useState(locationState?.query || '');
  const [country, setCountry] = useState(locationState?.country || 'US');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialSearchDone, setInitialSearchDone] = useState(false);

  // Default country options for display if needed
  const defaultCountries: CountryMap = {
    'US': { code: 'US', name: 'United States', currency: 'USD', websites: [] },
    'UK': { code: 'UK', name: 'United Kingdom', currency: 'GBP', websites: [] },
    'IN': { code: 'IN', name: 'India', currency: 'INR', websites: [] },
    'CA': { code: 'CA', name: 'Canada', currency: 'CAD', websites: [] },
    'AU': { code: 'AU', name: 'Australia', currency: 'AUD', websites: [] },
    'DE': { code: 'DE', name: 'Germany', currency: 'EUR', websites: [] }
  };

  useEffect(() => {
    // Only perform initial search if we have query and country from location state
    // and haven't done the initial search yet
    if (locationState?.query && locationState?.country && !initialSearchDone) {
      setInitialSearchDone(true);
      handleSearch();
    }
  }, [locationState, initialSearchDone]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    try {
      setLoading(true);
      setError(null);
      setProducts([]);
      
      // Update URL with search parameters
      navigate('/search', { 
        state: { query, country },
        replace: true
      });
      
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch();
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Search for a product"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., iPhone 16 Pro"
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <CountryDropdown 
              value={country} 
              onChange={handleCountryChange}
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert 
          severity="info" 
          sx={{ mb: 2 }}
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
      ) : (
        <>
          {products.length > 0 ? (
            <>
              <Typography variant="h5" component="h2" gutterBottom>
                Search Results for "{query}" in {defaultCountries[country]?.name || country}
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
                        <Chip
                          label={product.website}
                          size="small"
                          color="secondary"
                          variant="outlined"
                          sx={{ mb: 1 }}
                        />
                        {product.rating !== undefined && product.rating > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating value={product.rating} precision={0.5} readOnly size="small" />
                            {product.reviews !== undefined && product.reviews > 0 && (
                              <Typography variant="body2" sx={{ ml: 1 }}>
                                ({product.reviews})
                              </Typography>
                            )}
                          </Box>
                        )}
                        {product.availability && (
                          <Typography variant="body2" color="text.secondary">
                            {product.availability}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          ) : (
            !loading && !error && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary">
                  No products found. Try a different search query or country.
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }} 
                  onClick={handleSearch}
                >
                  Try Again
                </Button>
              </Box>
            )
          )}
        </>
      )}
    </Box>
  );
};

export default SearchResultsPage; 