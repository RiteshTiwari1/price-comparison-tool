import { CountryConfig } from '../types';

// Country configurations
export const countries: { [key: string]: CountryConfig } = {
  'US': {
    code: 'US',
    name: 'United States',
    currency: 'USD',
    websites: ['amazon', 'bestbuy', 'walmart', 'target', 'newegg']
  },
  'IN': {
    code: 'IN',
    name: 'India',
    currency: 'INR',
    websites: ['amazon', 'flipkart', 'croma', 'reliance']
  },
  'UK': {
    code: 'UK',
    name: 'United Kingdom',
    currency: 'GBP',
    websites: ['amazon', 'argos', 'currys', 'johnlewis']
  },
  'CA': {
    code: 'CA',
    name: 'Canada',
    currency: 'CAD',
    websites: ['amazon', 'bestbuy', 'walmart', 'thesource']
  },
  'AU': {
    code: 'AU',
    name: 'Australia',
    currency: 'AUD',
    websites: ['amazon', 'jbhifi', 'kogan', 'harveynorman']
  },
  'DE': {
    code: 'DE',
    name: 'Germany',
    currency: 'EUR',
    websites: ['amazon', 'saturn', 'mediamarkt', 'otto']
  }
};

// Function to get websites for a specific country
export const getWebsitesForCountry = (countryCode: string): string[] => {
  const country = countries[countryCode.toUpperCase()];
  if (!country) {
    // Default to US websites if country not found
    return countries['US'].websites;
  }
  return country.websites;
}; 