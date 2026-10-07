import { toggleWatchList, isCoinWatchList, getWatchList } from "./watchlist.js";
import { fetchTopCoins } from "./api.js";
import { displayCryptoDashboard, renderWatchlist, marketOverview } from "./ui.js";

let cryptoData = [];

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

function handleWatchlistToggle(coinId) {
  toggleWatchList(coinId);
  renderWatchlist(cryptoData);
  updateMainStarButton(coinId);
}

const coinsTableBody = document.querySelector(".coins-table tbody");

coinsTableBody.addEventListener("click", (event) => {
  const starButton = event.target.closest(".coins-table__star-btn");
  if (!starButton) return;

  const coinId = starButton.closest(".coins-table__row").dataset.id;
  handleWatchlistToggle(coinId);
});

const watchlistTableBody = document.querySelector(".watchlist__table tbody");

watchlistTableBody.addEventListener("click", (event) => {
  const starButton = event.target.closest(".watchlist__star-btn");
  if (!starButton) return;

  const coinId = starButton.closest("tr").dataset.id;
  handleWatchlistToggle(coinId);
});

document.addEventListener("DOMContentLoaded", async () => {
  cryptoData = await fetchTopCoins();
  displayCryptoDashboard(cryptoData);
  renderWatchlist(cryptoData);
  getWatchList().forEach(updateMainStarButton);
  marketOverview(cryptoData);
});
