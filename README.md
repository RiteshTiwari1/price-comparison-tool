# Price Comparison Tool

A tool that can fetch prices of products from multiple websites based on the country the consumer is shopping from. It fetches rates from all websites selling the product for a given country and ensures that the product matches the requirements.

## Features

- Search for product prices across multiple e-commerce websites
- Filter by country to get region-specific results
- Sort results by price (ascending)
- View detailed product information including ratings and reviews
- Responsive UI that works on desktop and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Node.js, Express, TypeScript
- **Data Source**: SerpApi for reliable product data
- **Containerization**: Docker, Docker Compose

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- [SerpApi](https://serpapi.com/) API key (free tier available)

## Installation and Setup

### Using Docker (Recommended)

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/price-comparison-tool.git
   cd price-comparison-tool
   ```

2. Create a `.env` file in the root directory with your SerpApi API key:
   ```
   SERPAPI_API_KEY=your_serpapi_api_key_here
   ```

3. Build and run the containers:
   ```
   docker-compose up -d
   ```

4. Access the application:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Running Locally (Development)

#### Backend

1. Navigate to the backend directory:
   ```
   cd price-comparison-tool/backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following content:
   ```
   PORT=3000
   NODE_ENV=development
   SERPAPI_API_KEY=your_serpapi_api_key_here
   ```

4. Start the development server:
   ```
   npm run dev
   ```

#### Frontend

1. Navigate to the frontend directory:
   ```
   cd price-comparison-tool/frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Access the frontend at http://localhost:5173

## API Endpoints

- `POST /api/products/search` - Search for products
  ```json
  {
    "country": "US",
    "query": "iPhone 16 Pro"
  }
  ```

- `GET /api/products/countries` - Get supported countries

## Example cURL Request

```bash
curl -X POST http://localhost:3000/api/products/search \
  -H "Content-Type: application/json" \
  -d '{"country": "US", "query": "iPhone 16 Pro"}'
```

## Sample Response

```json
[
  {
    "link": "https://www.example.com/product/123",
    "price": 999,
    "currency": "USD",
    "productName": "Apple iPhone 16 Pro 128GB",
    "website": "Example Store",
    "imageUrl": "https://www.example.com/images/iphone16pro.jpg",
    "rating": 4.5,
    "reviews": 120,
    "availability": "In Stock"
  },
  ...
]
```

## Example Search Queries

Here are some examples of product searches you can try:

- Electronics:
  - `iPhone 16 Pro, 128GB`
  - `Samsung Galaxy S23 Ultra`
  - `Sony WH-1000XM5 headphones`
  - `MacBook Pro M3`
  - `Dell XPS 13 laptop`

- Home Appliances:
  - `Dyson V12 vacuum`
  - `Ninja Air Fryer 6-quart`
  - `KitchenAid Stand Mixer`
  - `Instant Pot Duo 6-quart`

- Fashion:
  - `Nike Air Jordan 1`
  - `Levi's 501 jeans`
  - `Ray-Ban Wayfarer sunglasses`

- Gaming:
  - `PlayStation 5 console`
  - `Xbox Series X`
  - `Nintendo Switch OLED`
  - `Logitech G Pro X gaming mouse`

## Supported Countries and Websites

The tool currently supports the following countries:
- US (United States)
- IN (India)
- UK (United Kingdom)
- CA (Canada)
- AU (Australia)
- DE (Germany)

And websites including:
- Amazon
- Best Buy
- Walmart
- Target
- Newegg
- And many more, depending on the country

## Using SerpApi

This project uses [SerpApi](https://serpapi.com/) to reliably fetch product data from multiple e-commerce websites. SerpApi offers:

- Reliable access to product data without getting blocked
- Structured data from multiple retailers
- Free tier with 100 searches per month

To use SerpApi:

1. Sign up for a free account at [serpapi.com](https://serpapi.com/)
2. Get your API key from your dashboard
3. Add the API key to your `.env` file as `SERPAPI_API_KEY=your_key_here`

## License

MIT 