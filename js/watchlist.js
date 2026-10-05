let watchlist = [];

export function toggleWatchList(coinId) {
  // const index = watchlist.indexOf(watchlist);

  // if (index !== -1) {
  //   watchlist.splice(index, 1);
  // } else {
  //   watchlist.push(coinId);
  // }

  const watchlistCoin = watchlist.find((coin) => coin.id === coinId);

  if (watchlistCoin) {
    watchlist = watchlist.filter((coin) => coin.id !== coinId);
  } else {
    watchlist.push(coinId);
  }

  return watchlist;
}

export function isCoinWatchList(coinId) {
  return watchlist.includes(coinId);
}

export function getWatchList() {
  return watchlist;
}
