import axios from "axios";

const CACHE_TTL_MS = Number(process.env.SPACEX_CACHE_TTL_MS) || 60000;
const cache = new Map<string, { data: unknown; expiresAt: number }>();

const fetchData = async (url: string) => {
  const now = Date.now();
  const cached = cache.get(url);
  if (cached && cached.expiresAt > now) {
    console.log(`Cache hit for ${url}`);
    return cached.data;
  }

  try {
    const response = await axios.get(url);
    const data = response.data;
    cache.set(url, { data, expiresAt: now + CACHE_TTL_MS });
    return data;
  } catch (error) {
    console.error(`Error fetching ${url}`, error);
    return cached?.data ?? {};
  }
};

export const fetchLaunches = async () => fetchData(`${process.env.SPACEX_API_URL}/launches`);
export const fetchRockets = async () => fetchData(`${process.env.SPACEX_API_URL}/rockets`);
