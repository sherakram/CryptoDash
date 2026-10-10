# CryptoDash

Live crypto market dashboard built with vanilla JavaScript (ES modules) and the CoinGecko API.

**Live demo:** <link>

![screenshot](./screenshot.png)

## Features
- Top 100 coins with pagination, 7-day sparklines
- Watchlist saved in localStorage, synced across tables
- Debounced live search with request cancellation (AbortController)
- Full-screen coin details sheet (native <dialog>, keyboard accessible)
- Light/dark theme, responsive layout, reduced-motion support

## What I learned
- Debounce, race conditions, and AbortController
- Pagination math and event delegation
- Accessible modal dialogs and focus management

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and add your CoinGecko demo key
3. `npm run dev`