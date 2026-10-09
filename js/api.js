const API_KEY = "CG-vsLXCXpvBxBQwc1RtVxs27A6";
const BASE_URL = "https://api.coingecko.com/api/v3/";

const HEADERS = {
  "x-cg-demo-api-key": API_KEY,
  accept: "application/json",
};

export async function fetchTopCoins() {
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

  const data = response.json();
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
