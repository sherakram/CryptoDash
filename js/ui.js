import { getWatchList } from "./watchlist.js";

const formatCompactUSD = (value) =>
  `$${new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(value)}`;

export function displayCryptoDashboard(coins) {
  const tbody = document.querySelector(".coins-table tbody");
  tbody.innerHTML = "";

  coins.forEach((coin) => {
    const tr = document.createElement("tr");
    tr.classList.add("coins-table__row");
    tr.setAttribute("data-id", coin.id);
    tr.setAttribute("data-name", coin.name);

    const tdStarBtn = document.createElement("td");
    tdStarBtn.classList.add("coins-table__td", "coins-table__td--action");
    tr.append(tdStarBtn);

    const button = document.createElement("button");
    button.classList.add("coins-table__star-btn");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", `Add ${coin.name} to watchlist`);
    button.textContent = "★";
    tdStarBtn.append(button);

    const tdRank = document.createElement("td");
    tdRank.classList.add(
      "coins-table__td",
      "coins-table__td--center",
      "coins-table__td--muted",
    );
    tdRank.textContent = coin.market_cap_rank;
    tr.append(tdRank);

    const tdImage = document.createElement("td");
    tdImage.classList.add("coins-table__td", "coins-table__td--coin");
    tr.append(tdImage);

    const img = document.createElement("img");
    img.classList.add("coins-table__logo");
    img.src = coin.image;
    img.setAttribute("alt", coin.name);
    tdImage.append(img);

    const coinInfo = document.createElement("div");
    coinInfo.classList.add("coins-table__coin-info");
    tdImage.append(coinInfo);

    const coinName = document.createElement("span");
    coinName.classList.add("coins-table__coin-name");
    coinName.textContent = coin.name;
    coinInfo.append(coinName);

    const coinSymbol = document.createElement("span");
    coinSymbol.classList.add("coins-table__coin-symbol");
    coinSymbol.textContent = coin.symbol.toUpperCase();
    coinInfo.append(coinSymbol);

    const tdPrice = document.createElement("td");
    tdPrice.classList.add(
      "coins-table__td",
      "coins-table__td--right",
      "coins-table__td--bold",
    );
    tdPrice.textContent = `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    tr.append(tdPrice);

    const formatPercentageCell = (value) => {
      const td = document.createElement("td");
      td.classList.add("coins-table__td", "coins-table__td--right");

      if (value !== null && value !== undefined) {
        const isPositive = value >= 0;
        td.classList.add(
          isPositive
            ? "coins-table__td--positive"
            : "coins-table__td--negative",
        );

        td.textContent = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;
      } else {
        td.textContent = "0.00%";
      }
      return td;
    };

    tr.append(
      formatPercentageCell(coin.price_change_percentage_1h_in_currency),
    );

    tr.append(
      formatPercentageCell(coin.price_change_percentage_24h_in_currency),
    );

    tr.append(
      formatPercentageCell(coin.price_change_percentage_7d_in_currency),
    );

    const td24Volume = document.createElement("td");
    td24Volume.classList.add("coins-table__td", "coins-table__td--right");
    td24Volume.textContent = formatCompactUSD(coin.total_volume);
    tr.append(td24Volume);

    const tdMarketCap = document.createElement("td");
    tdMarketCap.classList.add("coins-table__td", "coins-table__td--right");
    tdMarketCap.textContent = formatCompactUSD(coin.market_cap);
    tr.append(tdMarketCap);

    const tdMarketChart = document.createElement("td");
    tdMarketChart.classList.add("coins-table__td", "coins-table__td--center");
    tr.append(tdMarketChart);

    const chartPlaceholderBox = document.createElement("div");
    const is24hPositive =
      (coin.price_change_percentage_24h_in_currency || 0) >= 0;
    chartPlaceholderBox.classList.add(
      "coins-table__chart-placeholder",
      is24hPositive
        ? "coins-table__chart-placeholder--positive"
        : "coins-table__chart-placeholder--negative",
    );
    tdMarketChart.append(chartPlaceholderBox);

    const marketChartImg = document.createElement("img");
    marketChartImg.src = `https://data.coingecko.com/coins/1/sparkline.svg`;
    marketChartImg.setAttribute("alt", coin.name);
    chartPlaceholderBox.append(marketChartImg);

    const tdArrow = document.createElement("td");
    tdArrow.classList.add("coins-table__td", "coins-table__td--arrow");
    tdArrow.textContent = "❯";
    tr.append(tdArrow);

    tbody.append(tr);
  });
}

export function renderWatchlist(coins) {
  const tbody = document.querySelector(".watchlist__table tbody");
  tbody.innerHTML = "";

  const watchlist = getWatchList();

  const watchlistCoins = coins.filter((coin) => {
    return watchlist.includes(coin.id);
  });

  watchlistCoins.forEach((coin) => {
    const tr = document.createElement("tr");
    tr.classList.add("coins-table__row");
    tr.setAttribute("data-id", coin.id);
    tr.setAttribute("data-name", coin.name);

    const tdRank = document.createElement("td");
    tdRank.classList.add("watchlist__td", "watchlist__td--rank");
    tdRank.textContent = coin.market_cap_rank;
    tr.append(tdRank);

    const tdImage = document.createElement("td");
    tdImage.classList.add("watchlist__td", "watchlist__td--coin");
    tr.append(tdImage);

    const img = document.createElement("img");
    img.classList.add("watchlist__coin-logo");
    img.src = coin.image;
    img.setAttribute("alt", coin.name);
    tdImage.append(img);

    const coinName = document.createElement("span");
    coinName.classList.add("watchlist__coin-name");
    coinName.textContent = coin.name;
    tdImage.append(coinName);

    const coinSymbol = document.createElement("span");
    coinSymbol.classList.add("watchlist__coin-symbol");
    coinSymbol.textContent = coin.symbol.toUpperCase();
    tdImage.append(coinSymbol);

    const tdPrice = document.createElement("td");
    tdPrice.classList.add("watchlist__td", "watchlist__td--price");
    tdPrice.textContent = `$${coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`;
    tr.append(tdPrice);

    const formatPercentageCell = (value) => {
      const td = document.createElement("td");
      td.classList.add("watchlist__td", "watchlist__td--change");

      if (value !== null && value !== undefined) {
        const isPositive = value >= 0;
        td.classList.add(
          isPositive ? "watchlist__td--positive" : "watchlist__td--negative",
        );

        td.textContent = `${isPositive ? "+" : ""}${value.toFixed(2)}%`;
      } else {
        td.textContent = "0.00%";
      }
      return td;
    };

    tr.append(
      formatPercentageCell(coin.price_change_percentage_1h_in_currency),
    );

    tr.append(
      formatPercentageCell(coin.price_change_percentage_24h_in_currency),
    );

    tr.append(
      formatPercentageCell(coin.price_change_percentage_7d_in_currency),
    );

    const tdMarketChart = document.createElement("td");
    tdMarketChart.classList.add("watchlist__td", "watchlist__td--chart");
    tr.append(tdMarketChart);

    const chartPlaceholderBox = document.createElement("div");
    const is24hPositive =
      (coin.price_change_percentage_24h_in_currency || 0) >= 0;
    chartPlaceholderBox.classList.add(
      "watchlist__sparkline",
      is24hPositive
        ? "coins-table__chart-placeholder--positive"
        : "coins-table__chart-placeholder--negative",
    );
    tdMarketChart.append(chartPlaceholderBox);

    const marketChartImg = document.createElement("img");
    marketChartImg.src = `https://data.coingecko.com/coins/1/sparkline.svg`;
    marketChartImg.setAttribute("alt", coin.name);
    chartPlaceholderBox.append(marketChartImg);

    const tdStarBtn = document.createElement("td");
    tdStarBtn.classList.add("watchlist__td", "watchlist__td--action");
    tr.append(tdStarBtn);

    const button = document.createElement("button");
    button.classList.add("watchlist__star-btn", "watchlist__star-btn--active");
    button.setAttribute("type", "button");
    button.setAttribute("aria-label", `remove ${coin.name} from watchlist`);
    button.textContent = "★";
    tdStarBtn.append(button);

    tbody.append(tr);
  });
}

export function marketOverview(coins) {
  const marketInfo = document.querySelector(".market-overview__info");
  marketInfo.innerHTML = "";

  const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);

  const totalChange24h = coins.reduce((sum, coin) => {
    const change = coin.market_cap_change_percentage_24h ?? 0;
    return sum + change * coin.market_cap;
  }, 0) / totalMarketCap;

  const marketLabel = document.createElement("span");
  marketLabel.classList.add("market-overview__label");
  marketLabel.textContent = "Total Market Cap";
  marketInfo.append(marketLabel);

  const p = document.createElement("p");
  p.classList.add("market-overview__value");
  p.setAttribute("id", "total-market-cap");
  p.textContent = formatCompactUSD(totalMarketCap);
  marketInfo.append(p);

  const isPositive = totalChange24h >= 0;
  const span = document.createElement("span");
  span.classList.add(
    "market-overview__percentage",
    isPositive
      ? "market-overview__percentage--positive"
      : "market-overview__percentage--negative"
  );
  span.setAttribute("id", "total-market-cap-change");
  span.textContent = `${isPositive ? "+" : ""}${totalChange24h.toFixed(2)}% (24h)`;
  marketInfo.append(span);
}
