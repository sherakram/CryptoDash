let watchlist = [];

export function toggleWatchList(coinId) {
  const index = watchlist.indexOf(coinId);

  if (index !== -1) {
    watchlist.splice(index, 1);
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
