# ExpenseSnap - Personal Expense Logger PWA

A Progressive Web App for tracking personal expenses, viewing spending by category in simple charts, and getting monthly summaries. All data is stored locally - no accounts required.

## Features

- Quick expense logging by category
- Monthly spending summaries
- Pie charts for category breakdown
- Local storage for data persistence
- Offline-capable PWA
- Responsive design for mobile and desktop

## Categories

- Food & Dining
- Transportation
- Entertainment
- Shopping
- Bills & Utilities
- Health & Fitness
- Other

## Setup

1. Install dependencies (if any):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open http://localhost:3000 in your browser

## Usage

- Enter expense amount, select category, choose date
- Click "Add Expense" to log it
- View monthly total and budget status
- See spending breakdown in the pie chart
- Review recent expenses in the list
- Delete expenses if needed

## Technologies

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js for visualizations
- Service Worker for PWA functionality

## Data Storage

All expense data is stored locally in your browser using localStorage. No data is sent to external servers.
