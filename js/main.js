import { toggleWatchList, isCoinWatchList, getWatchList } from "./watchlist.js";
import { fetchTopCoins, fetchGlobalData, searchCoins, fetchCoinsByIds } from "./api.js";
import {
  displayCryptoDashboard,
  renderWatchlist,
  renderMarketOverview,
  renderPagination,
  renderCoinSheet,
  updateSheetStar,
} from "./ui.js";
import { debounce } from "./utils.js";

const coinSheet = document.querySelector("#coin-sheet");
let activeSheetCoinId = null;

let visibleCoins = [];

const searchInput = document.querySelector("#search");
const searchForm = document.querySelector(".header__search-form");
const tableStatus = document.querySelector("#table-status");
let searchController = null;

let cryptoData = [];

const PAGE_SIZE = 10;
let currentPage = 1;
const paginationNav = document.querySelector("#pagination");

const coinsTableBody = document.querySelector(".coins-table tbody");
const watchlistTableBody = document.querySelector(".watchlist__table tbody");

const themeToggleLight = document.querySelector(".header__toggle-btn--light");
const themeToggleDark = document.querySelector(".header__toggle-btn--dark");
const logoImg = document.querySelector(".header__logo-img");

const lightLogo = "assets/CryptoDash_Neon_Growth_Logo_light.png";
const darkLogo = "assets/CryptoDash_Neon_Growth_Logo_dark.png";

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  themeToggleLight.setAttribute("aria-pressed", theme === "light");
  themeToggleDark.setAttribute("aria-pressed", theme === "dark");

  if (theme === "light") {
    logoImg.setAttribute("src", lightLogo);
    themeToggleLight.classList.add("toggle__Active");
    themeToggleDark.classList.remove("toggle__Active");
  } else {
    logoImg.setAttribute("src", darkLogo);
    themeToggleDark.classList.add("toggle__Active");
    themeToggleLight.classList.remove("toggle__Active");
  }
}
const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

async function runSearch(rawQuery) {
  const query = rawQuery.trim();

  searchController?.abort();

  if (query === "") {
    tableStatus.textContent = "";
    visibleCoins = cryptoData;
    currentPage = 1;
    renderCurrentPage();
    return;
  }

  searchController = new AbortController();
  const { signal } = searchController;

  tableStatus.textContent = `Searching for "${query}"…`;

  try {
    const matches = await searchCoins(query, signal);
    const results = await fetchCoinsByIds(
      matches.map((coin) => coin.id),
      signal,
    );

    visibleCoins = results;
    currentPage = 1;
    renderCurrentPage();

    tableStatus.textContent =
      results.length === 0
        ? `No coins found for "${query}".`
        : `${results.length} result(s) for "${query}".`;
  } catch (error) {
    if (error.name === "AbortError") return;
    console.error(error);
    tableStatus.textContent = "Search failed. Please try again.";
  }
}

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function updateMainStarButton(coinId) {
  const row = coinsTableBody.querySelector(`[data-id="${coinId}"]`);
  if (!row) return;

  const button = row.querySelector(".coins-table__star-btn");
  const coinName = row.dataset.name;
  const isInWatchlist = isCoinWatchList(coinId);

  button.classList.toggle("coins-table__star-btn--active", isInWatchlist);
  button.setAttribute("aria-pressed", isInWatchlist);
  button.setAttribute(
    "aria-label",
    isInWatchlist
      ? `Remove ${coinName} from watchlist`
      : `Add ${coinName} to watchlist`,
  );
}

function animateRowRemoval(coinId) {
  const row = document.querySelector(
    `.watchlist__table tbody tr[data-id="${coinId}"]`,
  );

  if (!row || prefersReducedMotion()) {
    renderWatchlist(cryptoData);
    return;
  }

  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    renderWatchlist(cryptoData);
  };

  row.classList.add("watchlist__row--leaving");
  row.addEventListener("animationend", finish, { once: true });
  setTimeout(finish, 400);
}

function handleWatchlistToggle(coinId) {
  const wasInWatchlist = isCoinWatchList(coinId);

  toggleWatchList(coinId);
  updateMainStarButton(coinId);

  if (wasInWatchlist) {
    animateRowRemoval(coinId);
  } else {
    renderWatchlist(cryptoData, coinId);
  }

  if (coinSheet.open && activeSheetCoinId === coinId) {
    updateSheetStar(isCoinWatchList(coinId));
  }
}

function renderCurrentPage() {
  const totalPages = Math.max(1, Math.ceil(visibleCoins.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageCoins = visibleCoins.slice(start, start + PAGE_SIZE);

  displayCryptoDashboard(pageCoins);
  getWatchList().forEach(updateMainStarButton);

  renderPagination({
    currentPage,
    totalPages,
    totalItems: visibleCoins.length,
    pageSize: PAGE_SIZE,
  });
}

function findCoin(coinId) {
  return (
    visibleCoins.find((coin) => coin.id === coinId) ??
    cryptoData.find((coin) => coin.id === coinId)
  );
}

function openCoinSheet(coinId) {
  const coin = findCoin(coinId);
  if (!coin) return;

  activeSheetCoinId = coinId;
  renderCoinSheet(coin, isCoinWatchList(coinId));

  coinSheet.classList.remove("coin-sheet--closing");
  coinSheet.showModal();
  coinSheet.querySelector(".coin-sheet__panel").scrollTop = 0;
}

function closeCoinSheet() {
  if (!coinSheet.open || coinSheet.classList.contains("coin-sheet--closing")) return;

  if (prefersReducedMotion()) {
    coinSheet.close();
    return;
  }

  coinSheet.classList.add("coin-sheet--closing");

  const onEnd = (event) => {
    if (event.target !== coinSheet) return;
    coinSheet.removeEventListener("animationend", onEnd);
    coinSheet.classList.remove("coin-sheet--closing");
    coinSheet.close();
  };
  coinSheet.addEventListener("animationend", onEnd);
}

themeToggleLight.addEventListener("click", () => {
  setTheme("light");
});

themeToggleDark.addEventListener("click", () => {
  setTheme("dark");
});

const debouncedSearch = debounce(runSearch, 400);

searchInput.addEventListener("input", (event) => {
  debouncedSearch(event.target.value);
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  debouncedSearch.cancel();
  runSearch(searchInput.value);
});

// coinsTableBody.addEventListener("click", (event) => {
//   const starButton = event.target.closest(".coins-table__star-btn");
//   if (!starButton) return;

//   const coinId = starButton.closest(".coins-table__row").dataset.id;
//   handleWatchlistToggle(coinId);
// });

// watchlistTableBody.addEventListener("click", (event) => {
//   const starButton = event.target.closest(".watchlist__star-btn");
//   if (!starButton) return;

//   const coinId = starButton.closest("tr").dataset.id;
//   handleWatchlistToggle(coinId);
// });

coinsTableBody.addEventListener("click", (event) => {
  const row = event.target.closest(".coins-table__row");
  if (!row) return;
  const coinId = row.dataset.id;

  if (event.target.closest(".coins-table__star-btn")) {
    handleWatchlistToggle(coinId);
    return;
  }

  if (event.target.closest(".coins-table__td--coin, .coins-table__td--arrow")) {
    openCoinSheet(coinId);
  }
});

watchlistTableBody.addEventListener("click", (event) => {
  const row = event.target.closest("tr");
  if (!row) return;
  const coinId = row.dataset.id;

  if (event.target.closest(".watchlist__star-btn")) {
    handleWatchlistToggle(coinId);
    return;
  }

  if (event.target.closest(".watchlist__td--coin")) {
    openCoinSheet(coinId);
  }
});

paginationNav.addEventListener("click", (event) => {
  const btn = event.target.closest("button[data-page]");
  if (!btn || btn.disabled) return;

  currentPage = Number(btn.dataset.page);
  renderCurrentPage();

  paginationNav
    .querySelector('[aria-current="page"]')
    ?.focus({ preventScroll: true });

  document.querySelector("#main_table").scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
});

document.querySelector("#sheet-close").addEventListener("click", closeCoinSheet);

document.querySelector("#sheet-star").addEventListener("click", () => {
  if (activeSheetCoinId) handleWatchlistToggle(activeSheetCoinId);
});

coinSheet.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCoinSheet();
});

coinSheet.addEventListener("close", () => {
  activeSheetCoinId = null;
});

document.addEventListener("DOMContentLoaded", async () => {
  tableStatus.textContent = "Loading coins…";

  const [coins, globalData] = await Promise.all([
    fetchTopCoins(),
    fetchGlobalData(),
  ]);
  
  cryptoData = coins;
  visibleCoins = cryptoData;

  tableStatus.textContent =
    cryptoData.length === 0
      ? import.meta.env.VITE_CG_API_KEY
        ? "Couldn't load coins right now. Please try again in a minute."
        : "Missing API key. Copy .env.example to .env and add your CoinGecko key."
      : "";

  renderCurrentPage();
  renderWatchlist(cryptoData);
  renderMarketOverview(globalData);
});
