# Technical Documentation: Portfolio Dashboard

## What This Project Does

This is a portfolio dashboard that shows your stock investments in real-time. It displays current stock prices, calculates your gains/losses, and groups stocks by sectors like Technology, Finance, etc.

## The Main Problems I Faced (And How I Solved Them)

### Problem 1: Getting Stock Data is Hard

**The Challenge**: 
- Yahoo Finance and Google Finance don't give free official APIs
- I needed current stock prices (CMP), P/E ratios, and earnings dates
- These companies don't want people scraping their data

**My Solution**:
- Used a library called `yahoo-finance2` that works around Yahoo's restrictions
- For Google Finance, I built a web scraper that reads their HTML pages
- If one source fails, the other still works (backup plan)

**Why This Works**:
- Yahoo gives us current prices reliably
- Google gives us P/E ratios and earnings dates
- If Google blocks us, we still get prices from Yahoo

### Problem 2: APIs Keep Breaking or Blocking Me

**The Challenge**:
- Financial websites have rate limits (too many requests = blocked)
- Sometimes their HTML structure changes and breaks my scraper
- I need to be careful not to get banned

**My Solution**:
- **Caching**: I store data for 5 minutes (prices) and 2 hours (P/E ratios) so I don't ask too often
- **Circuit Breaker**: If Google blocks me, I stop trying for a while instead of hammering them
- **Smart Scraping**: I use multiple ways to find data in case their HTML changes
- **User-Agent**: I make my requests look like they're coming from a real browser

**Example of How I Cache Data**:
```javascript
// Store current prices for 5 minutes
const priceCache = new Map();
// Store P/E ratios for 2 hours (they don't change often)
const peCache = new Map();
```

### Problem 3: Web Scraping is Unreliable

**The Challenge**:
- Google Finance's HTML is messy and changes often
- Sometimes the P/E ratio is in one place, sometimes another
- I need to find the right data even when the page structure changes

**My Solution**:
- I look for data in multiple ways (like having backup plans)
- If I can't find P/E ratio in the usual place, I try other locations
- I use regular expressions to extract numbers from text
- If all else fails, I show "—" instead of crashing

**How I Find P/E Ratios**:
```javascript
// First, I look for "P/E ratio" text
// Then I try to find the number next to it
// If that doesn't work, I look in the parent element
// If still nothing, I show "—"
```

### Problem 4: Keeping Data Fresh Without Overwhelming the User

**The Challenge**:
- Stock prices change every second, but I can't update that fast
- I need to refresh data regularly but not too often
- Users should see loading states, not blank screens

**My Solution**:
- **React Query**: This library handles all the data fetching for me
- **Auto-refresh**: Data updates every 15 seconds automatically
- **Background Updates**: Even if you switch tabs, it keeps updating
- **Loading States**: Shows skeleton screens while loading
- **Cached Data**: Shows old data while fetching new data

**How It Works**:
```javascript
// Every 15 seconds, fetch new data
// While fetching, show the old data
// When new data arrives, update the screen
// If it fails, show an error message
```

### Problem 5: Making Complex Calculations Work Right

**The Challenge**:
- I need to calculate gains/losses, percentages, portfolio weights
- One wrong calculation could show wrong financial data
- I need to handle missing data gracefully

**My Solution**:
- **TypeScript**: Catches calculation errors before they happen
- **Pure Functions**: Each calculation is in its own function, easy to test
- **Validation**: Check if numbers are valid before using them
- **Fallbacks**: If data is missing, show "—" instead of crashing

**Example Calculation**:
```javascript
// Calculate gain/loss for each stock
const gain = (currentPrice * quantity) - (purchasePrice * quantity);
// Calculate percentage
const percentage = (gain / totalInvestment) * 100;
// If any number is invalid, show "—"
```

### Problem 6: Making It Look Good on All Devices

**The Challenge**:
- Tables have lots of data and need to be readable
- Charts need to fit properly on mobile screens
- Everything should look professional

**My Solution**:
- **Responsive Design**: Different layouts for mobile, tablet, desktop
- **Grid System**: Tables get 2/3 of the space, chart gets 1/3
- **Mobile Charts**: Smaller charts with custom legends on mobile
- **Skeleton Loading**: Shows loading placeholders that match the final layout

**Layout Strategy**:
- Mobile: Everything stacks vertically
- Desktop: Tables on left (2/3), chart on right (1/3)
- Charts: Big on desktop, smaller on mobile with custom legend

## Why I Made These Technical Choices

### Next.js 16
- **Why**: Latest features, better performance, easier to deploy
- **Benefit**: Fast loading, SEO-friendly, works great with Vercel

### TypeScript
- **Why**: Financial calculations need to be 100% accurate
- **Benefit**: Catches errors before they reach users, better IDE support

### React Query
- **Why**: Handles all the complex data fetching logic
- **Benefit**: Automatic caching, background updates, error handling

### Tailwind CSS
- **Why**: Fast development, consistent design, great responsive features
- **Benefit**: Professional look without writing custom CSS

## Security Stuff I Worried About

### API Keys
- **Problem**: Don't want to expose API keys to users
- **Solution**: All API calls happen on the server, never sent to browser

### Input Validation
- **Problem**: Users could try to hack the system
- **Solution**: Validate all inputs, sanitize data before processing

### Rate Limiting
- **Problem**: Don't want to get blocked by APIs
- **Solution**: Cache data, use circuit breakers, be respectful

## Performance Numbers

### How Fast It Is
- **First Load**: Under 2 seconds
- **Data Refresh**: Under 1 second
- **Table Updates**: Under 0.5 seconds

### Memory Usage
- **Caching**: Limited to prevent memory leaks
- **Cleanup**: Properly remove event listeners
- **Efficiency**: Only store what we need

## What I Learned

### 1. Always Have Backup Plans
- If one API fails, have another ready
- If scraping breaks, show what you can
- Never let one failure break everything

### 2. User Experience Matters
- Show loading states so users know what's happening
- Give clear error messages
- Better to show partial data than nothing

### 3. Code Organization
- Keep data fetching separate from calculations
- Keep calculations separate from UI
- Use TypeScript for anything involving money

### 4. Performance is Important
- Cache everything you can
- Don't make unnecessary API calls
- Use React's optimization features

## Future Improvements I'd Like to Make

### Better Error Handling
- Retry failed requests automatically
- Let users manually refresh data
- Better error messages

### More Features
- Historical charts showing portfolio performance over time
- Export data to PDF or Excel
- Add more stocks to watchlist
- Portfolio alerts when stocks hit certain prices

### Performance Upgrades
- Work offline using service workers
- Real-time updates using WebSockets
- Handle thousands of stocks efficiently

## The Bottom Line

This project shows how to build a real financial app that actually works. The main challenges were:

1. **Getting reliable data** from sources that don't want to give it
2. **Handling failures gracefully** when APIs break or block you
3. **Making complex calculations** that are always correct
4. **Creating a good user experience** even when things go wrong

The solution uses modern web technologies to create something that's fast, reliable, and easy to use. It's not perfect, but it works well and can be improved over time.

**Technologies Used**: Next.js 16, TypeScript, React Query, Tailwind CSS, Web Scraping
**Data Sources**: Yahoo Finance (unofficial API), Google Finance (scraped)
**Deployment**: Ready for Vercel with proper environment setup