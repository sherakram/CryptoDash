import { toggleWatchList, isCoinWatchList, getWatchList } from "./watchlist.js";
import { fetchTopCoins } from "./api.js";
import { displayCryptoDashboard } from "./ui.js";

const coinsTableBody = document.querySelector(".coins-table tbody");

coinsTableBody.addEventListener("click", (event) => {
  const coinStarButton = event.target.closest(".coins-table__star-btn");

  if (coinStarButton) {
    const coinTableRow = coinStarButton.closest(".coins-table__row");
    const coinId = coinTableRow.dataset.id;
    const coinName = coinTableRow.dataset.name;

    toggleWatchList(coinId);

    const isInWatchlist = isCoinWatchList(coinId);

    coinStarButton.classList.toggle("coins-table__star-btn--active", isInWatchlist);
    coinStarButton.setAttribute("aria-pressed", isInWatchlist);
    coinStarButton.setAttribute("aria-label", isInWatchlist ? `remove ${coinName} from watchlist` : `add ${coinName} to watchlist`);
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const cryptoData = await fetchTopCoins();
  displayCryptoDashboard(cryptoData);
  renderWatchlist(cryptoData);
});
