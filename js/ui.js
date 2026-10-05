export function displayCryptoDashboard(coins) {
  const tbody = document.querySelector(".coins-table tbody");

  tbody.innerHTML = "";

  coins.forEach((coin) => {
    const tr = document.createElement("tr");
    tr.classList.add("coins-table__row");
    tr.setAttribute("data-id", coin.id);

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
    td24Volume.textContent = `$${Math.round(coin.total_volume).toLocaleString()}`;
    tr.append(td24Volume);

    const tdMarketCap = document.createElement("td");
    tdMarketCap.classList.add("coins-table__td", "coins-table__td--right");
    tdMarketCap.textContent = `$${coin.market_cap.toLocaleString()}`;
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
