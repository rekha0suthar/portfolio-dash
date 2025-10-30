# Dynamic Portfolio Dashboard

A real-time portfolio tracking application built with Next.js, TypeScript, and Tailwind CSS. This dashboard fetches live stock data from Yahoo Finance and Google Finance to provide investors with up-to-date portfolio insights.

## 🚀 Features

- **Real-time Data**: Live stock prices (CMP) from Yahoo Finance
- **Financial Metrics**: P/E ratios and latest earnings from Google Finance
- **Sector Grouping**: Stocks organized by sector with sector-level summaries
- **Auto-refresh**: Updates every 15 seconds automatically
- **Visual Indicators**: Color-coded gains/losses (green for gains, red for losses)
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Error Handling**: Graceful handling of API failures with user feedback

## 📊 Portfolio Columns

- **Particulars**: Stock name
- **Purchase Price**: Original buying price
- **Quantity**: Number of shares held
- **Investment**: Total amount invested (Purchase Price × Quantity)
- **Portfolio (%)**: Percentage weight in total portfolio
- **NSE/BSE**: Stock exchange code
- **CMP**: Current Market Price (live from Yahoo Finance)
- **Present Value**: Current value (CMP × Quantity)
- **Gain/Loss**: Profit/Loss with color coding
- **P/E Ratio**: Price-to-Earnings ratio (from Google Finance)
- **Latest Earnings**: Most recent earnings date (from Google Finance)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Data Fetching**: React Query (TanStack Query)
- **Table**: TanStack Table
- **HTTP Client**: Undici for server-side requests
- **HTML Parsing**: Cheerio for web scraping

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd portfolio-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) (or the port shown in terminal)

## 🔧 Configuration

### Adding Your Holdings

Edit `src/data/holdings.json` to add your stock holdings:

```json
[
  {
    "ticker": "INFY.NS",
    "name": "Infosys",
    "sector": "Technology",
    "exchange": "NSE",
    "purchasePrice": 1380,
    "qty": 12
  }
]
```

**Note**: Use the correct ticker format:
- NSE stocks: `TICKER.NS` (e.g., `INFY.NS`)
- BSE stocks: `TICKER.BO` (e.g., `RELIANCE.BO`)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── api/quotes/          # API endpoint for fetching quotes
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main dashboard page
│   └── providers.tsx        # React Query provider
├── components/
│   └── PortfolioTable.tsx   # Table component for displaying holdings
├── data/
│   └── holdings.json        # Portfolio holdings data
└── lib/
    ├── cache.ts             # LRU cache implementation
    ├── math.ts              # Utility functions for calculations
    ├── providers/           # Data providers
    │   ├── google.ts        # Google Finance scraper
    │   ├── yahoo.ts         # Yahoo Finance API client
    │   └── index.ts         # Main data fetching orchestrator
    ├── tickers.ts           # Ticker utilities
    └── types.ts             # TypeScript type definitions
```

## 🔄 Data Sources

### Yahoo Finance
- **Purpose**: Current Market Price (CMP)
- **Method**: Unofficial API using `yahoo-finance2` library
- **Update Frequency**: Every 15 seconds
- **Caching**: 5 minutes TTL

### Google Finance
- **Purpose**: P/E Ratio and Latest Earnings
- **Method**: Web scraping using Cheerio
- **Update Frequency**: Every 15 seconds
- **Caching**: 2 hours TTL
- **Rate Limiting**: Circuit breaker pattern to prevent blocks

## ⚠️ Important Notes

### API Limitations
- **Unofficial APIs**: Both Yahoo and Google Finance use unofficial methods
- **Rate Limiting**: Implemented caching and circuit breaker patterns
- **Data Accuracy**: Scraped data may vary; use for informational purposes only
- **Reliability**: APIs may break due to website changes
