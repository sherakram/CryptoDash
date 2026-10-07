import { toggleWatchList, isCoinWatchList, getWatchList } from "./watchlist.js";
import { fetchTopCoins } from "./api.js";
import {
  displayCryptoDashboard,
  renderWatchlist,
  marketOverview,
  renderPagination,
} from "./ui.js";

let cryptoData = [];

const PAGE_SIZE = 10;
let currentPage = 1;
const paginationNav = document.querySelector("#pagination");

const coinsTableBody = document.querySelector(".coins-table tbody");
const watchlistTableBody = document.querySelector(".watchlist__table tbody");

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
}

function renderCurrentPage() {
  const totalPages = Math.max(1, Math.ceil(cryptoData.length / PAGE_SIZE));
  currentPage = Math.min(Math.max(currentPage, 1), totalPages);

  const start = (currentPage - 1) * PAGE_SIZE;
  const pageCoins = cryptoData.slice(start, start + PAGE_SIZE);

  displayCryptoDashboard(pageCoins);
  getWatchList().forEach(updateMainStarButton);

  renderPagination({
    currentPage,
    totalPages,
    totalItems: cryptoData.length,
    pageSize: PAGE_SIZE,
  });
}

coinsTableBody.addEventListener("click", (event) => {
  const starButton = event.target.closest(".coins-table__star-btn");
  if (!starButton) return;

  const coinId = starButton.closest(".coins-table__row").dataset.id;
  handleWatchlistToggle(coinId);
});

watchlistTableBody.addEventListener("click", (event) => {
  const starButton = event.target.closest(".watchlist__star-btn");
  if (!starButton) return;

  const coinId = starButton.closest("tr").dataset.id;
  handleWatchlistToggle(coinId);
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

document.addEventListener("DOMContentLoaded", async () => {
  cryptoData = await fetchTopCoins();
  renderCurrentPage();
  renderWatchlist(cryptoData);
  marketOverview(cryptoData);
});
