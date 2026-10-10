# CryptoDash

A responsive, accessible crypto market dashboard built with **vanilla JavaScript (ES modules)** and the **CoinGecko API**. Track the top 100 coins, build a persistent watchlist, search live and open a full-screen detail view for any coin.

![JavaScript](https://img.shields.io/badge/JavaScript-ES%20Modules-F7DF1E?logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-build%20tool-646CFF?logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-custom%20properties%20%2B%20grid-1572B6?logo=css3&logoColor=white)
![CoinGecko](https://img.shields.io/badge/Data-CoinGecko%20API-8DC63F)

**Live demo:** [your-live-demo-link](https://your-live-demo-link) &nbsp;|&nbsp; **Source:** [github.com/sherakram/CryptoDash](https://github.com/sherakram/CryptoDash)

![CryptoDash desktop view](docs/screenshots/desktop.png)

<p align="center">
  <img src="docs/screenshots/mobile-sheet.png" alt="Coin details sheet on mobile" width="280" />
</p>

## Features

**Market data**
- Market overview cards (total market cap, 24h volume, BTC dominance) from the CoinGecko `/global` endpoint
- Top 100 coins by market cap with 1h / 24h / 7d changes, volume, market cap and 7-day sparklines
- Client-side pagination (10 coins per page)

**Watchlist**
- Star any coin from the main table or the detail view
- Persisted in `localStorage`, so it survives refreshes
- Both tables and the detail view stay in sync from a single toggle function
- Animated add / remove and a friendly empty state

**Search**
- Debounced live search (400 ms) against the CoinGecko `/search` endpoint
- In-flight requests are cancelled with `AbortController`, which prevents stale results from overwriting newer ones
- Loading, no-results and error states

**Coin details**
- Full-screen bottom sheet that slides up from the bottom on every screen size
- Price, rank, market cap, volume, 1h / 24h / 7d change, 24h range, all-time high / low and supply
- 7-day price chart drawn as inline SVG (no chart library)
- Built entirely from data that is already loaded, so opening it costs **zero extra API calls**

**UX and accessibility**
- Light and dark themes with a saved preference
- Responsive layout from phone to desktop
- Native `<dialog>` for the detail view: focus trap, `Esc` to close, focus returns to the trigger
- Keyboard-operable controls, `aria-pressed` toggles, live status messages for search and loading
- Respects `prefers-reduced-motion`

## Tech stack

| Area | Choice |
| --- | --- |
| Markup and styles | HTML5, CSS3 (custom properties, grid, flexbox, BEM naming) |
| Logic | Vanilla JavaScript, ES modules, no framework |
| Tooling | Vite |
| Data | [CoinGecko API](https://www.coingecko.com/en/api) (free Demo plan) |

## Engineering notes

- **Debounce + AbortController.** Typing "bitcoin" sends one request pair instead of seven, and a slow response for "bit" can never replace the results for "bitcoin".
- **Filter, then paginate.** Pagination works on whichever list is currently visible (top 100 or search results), so page counts and the "Showing 11 – 20 of 100" label are always correct.
- **Event delegation.** One click listener per table and one for pagination keep working after rows are re-rendered.
- **Rate-limit friendly.** Top coins and global stats are cached in `localStorage` for 5 minutes, searches use a single follow-up request, and the detail view reuses loaded data.
- **Defensive rendering.** Missing API fields (for example a coin with no max supply) render as an em dash instead of breaking the UI.

## Getting started

### Prerequisites

- A recent LTS version of [Node.js](https://nodejs.org/)
- A free CoinGecko Demo API key ([get one here](https://www.coingecko.com/en/api))

### Installation

```bash
git clone https://github.com/sherakram/CryptoDash.git
cd CryptoDash
npm install
```

Create your environment file and add your key:

```bash
cp .env.example .env      # on Windows PowerShell: Copy-Item .env.example .env
```

```env
VITE_CG_API_KEY=your_coingecko_demo_key
```

Start the dev server:

```bash
npm run dev
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |

> Restart the dev server after changing `.env`. Vite reads environment variables only at startup.

## Project structure

```text
CryptoDash/
├── public/
│   └── assets/            # logos
├── css/
│   ├── variables.css      # design tokens (colors, spacing, type)
│   ├── style.css          # base and component styles
│   └── responsive.css     # breakpoints
├── js/
│   ├── main.js            # app state, events, orchestration
│   ├── api.js             # CoinGecko requests and caching
│   ├── ui.js              # DOM rendering (tables, sheet, pagination)
│   ├── watchlist.js       # watchlist state and localStorage
│   └── utils.js           # debounce helper
├── index.html
├── .env.example
└── package.json
```

## Notes

- **API key exposure.** This is a client-side app, so the Demo key is visible in the browser's network requests. That is acceptable for a free Demo key, but a paid key should live behind a serverless function or backend proxy.
- **Data freshness.** Prices are a snapshot from the last load (or cache). Refresh the page for newer data.
- **Disclaimer.** For learning and demonstration only. Nothing here is financial advice.

## Possible improvements

- Time-range tabs (1D / 1M / 1Y) in the detail view, lazy-loaded and cached
- Sortable table columns
- Unit tests for the pagination and formatting helpers

## Author

**Sher** &nbsp;·&nbsp; [GitHub](https://github.com/sherakram) &nbsp;·&nbsp; [Portfolio](https://your-portfolio-link) &nbsp;·&nbsp; [LinkedIn](https://your-linkedin-link)

## License

Released under the ISC License.

## Acknowledgements

Market data provided by [CoinGecko](https://www.coingecko.com/).
