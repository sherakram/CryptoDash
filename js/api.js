const API_KEY = import.meta.env.VITE_CG_API_KEY;
const BASE_URL = "https://api.coingecko.com/api/v3/";

if (!API_KEY) {
  console.warn("Missing VITE_CG_API_KEY. Check your .env file.");
}

const HEADERS = {
  "x-cg-demo-api-key": API_KEY,
  accept: "application/json",
};

export async function fetchTopCoins() {
  const cached = readCache("cache:top-coins");
  if (cached) return cached;

  const endpoint = `${BASE_URL}coins/markets`;

  const url = `${endpoint}?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: HEADERS,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    const data = await response.json();
    writeCache("cache:top-coins", data);
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function searchCoins(query, signal) {
  const url = `${BASE_URL}search?query=${encodeURIComponent(query)}`;
  const response = await fetch(url, {headers: HEADERS, signal});

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data.coins.slice(0, 10);
}

export async function fetchCoinsByIds(ids, signal) {
  if (ids.length === 0) return [];

  const url = `${BASE_URL}coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=1h,24h,7d`;
  const response = await fetch(url, {headers: HEADERS, signal});

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}

export async function fetchGlobalData() {
  const cached = readCache("cache:global");
  if (cached) return cached;

  try {
    const response = await fetch(`${BASE_URL}global`, { headers: HEADERS });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const { data } = await response.json();
    writeCache("cache:global", data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const CACHE_TTL = 5 * 60 * 1000;

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { time, data } = JSON.parse(raw);
    return Date.now() - time < CACHE_TTL ? data : null;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ time: Date.now(), data }));
  } catch {
  }
}
