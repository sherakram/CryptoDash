const API_KEY = "CG-vsLXCXpvBxBQwc1RtVxs27A6";
const BASE_URL = "https://api.coingecko.com/api/v3/";

export async function fetchTopCoins() {
  const endpoint = `${BASE_URL}coins/markets`;

  const url = `${endpoint}?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=1h,24h,7d`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-cg-demo-api-key": API_KEY,
        accept: "application/json",
      },
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
