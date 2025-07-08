/**
 * Simple logger utility for consistent logging
 */
const logger = {
  info: (message: string): void => {
    console.log(`[INFO] ${message}`);
  },
  
  warn: (message: string): void => {
    console.warn(`[WARNING] ${message}`);
  },
  
  error: (message: string): void => {
    console.error(`[ERROR] ${message}`);
  },
  
  debug: (message: string): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`);
    }
  }
};

export default logger; 