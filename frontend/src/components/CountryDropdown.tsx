import { useState, useEffect } from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  SelectChangeEvent,
} from '@mui/material';
import { getCountries } from '../services/api';
import { CountryMap } from '../types';

interface CountryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

// Default country options in case API fails
const defaultCountries: CountryMap = {
  'US': { code: 'US', name: 'United States', currency: 'USD', websites: [] },
  'UK': { code: 'UK', name: 'United Kingdom', currency: 'GBP', websites: [] },
  'IN': { code: 'IN', name: 'India', currency: 'INR', websites: [] },
  'CA': { code: 'CA', name: 'Canada', currency: 'CAD', websites: [] },
  'AU': { code: 'AU', name: 'Australia', currency: 'AUD', websites: [] },
  'DE': { code: 'DE', name: 'Germany', currency: 'EUR', websites: [] }
};

const CountryDropdown = ({ 
  value, 
  onChange, 
  label = 'Country',
  fullWidth = true,
  disabled = false
}: CountryDropdownProps) => {
  const [countries, setCountries] = useState<CountryMap>(defaultCountries);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const countriesData = await getCountries();
        
        // Only update state if component is still mounted
        if (isMounted && Object.keys(countriesData).length > 0) {
          setCountries(countriesData);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
        // Default countries are already set in initial state
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCountries();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl fullWidth={fullWidth} variant="outlined">
      <InputLabel id="country-select-label">{label}</InputLabel>
      <Select
        labelId="country-select-label"
        id="country-select"
        value={value}
        label={label}
        onChange={handleChange}
        disabled={loading || disabled}
        MenuProps={{
          PaperProps: {
            style: { maxHeight: 300 }
          }
        }}
      >
        {loading ? (
          <MenuItem value="">
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          Object.entries(countries).map(([code, country]) => (
            <MenuItem key={code} value={code}>
              {country.name}
            </MenuItem>
          ))
        )}
      </Select>
    </FormControl>
  );
};

export default CountryDropdown; 