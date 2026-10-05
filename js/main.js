import { toggleWatchList, isCoinWatchList, getWatchList } from "./watchlist.js";
import { fetchTopCoins } from "./api.js";
import { displayCryptoDashboard } from "./ui.js";

const coinsTableBody = document.querySelector(".coins-table tbody");

coinsTableBody.addEventListener("click", (event) => {
  const coinStarButton = event.target.closest(".coins-table__star-btn");

  if (coinStarButton) {
    const coinTableRow = coinStarButton.closest(".coins-table__row");
    const coinId = coinTableRow.dataset.id;

    toggleWatchList(coinId);

    coinStarButton.classList.toggle("coins-table__star-btn--active");

    isCoinWatchList(coinId);
    getWatchList();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  const cryptoData = await fetchTopCoins();
  displayCryptoDashboard(cryptoData);
});
