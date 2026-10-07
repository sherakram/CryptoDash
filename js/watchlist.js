const STORAGE_KEY = "crypto-watchlist";

function loadWatchlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Watchlist load failed:", error);
    return [];
  }
}

function saveWatchlist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
  } catch (error) {
    console.error("Watchlist save failed:", error);
  }
}

let watchlist = loadWatchlist();

export function toggleWatchList(coinId) {
  const index = watchlist.indexOf(coinId);

  if (index !== -1) {
    watchlist.splice(index, 1);
  } else {
    watchlist.push(coinId);
  }

  saveWatchlist();
  return watchlist;
}

export function isCoinWatchList(coinId) {
  return watchlist.includes(coinId);
}

export function getWatchList() {
  return watchlist;
}