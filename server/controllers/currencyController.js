import axios from 'axios';
import cache from '../utils/currencyCache.js';
import logger from '../utils/logger.js';

const TEN_MINUTES = 10 * 60 * 1000;

async function fetchRate(force = false) {
  const cached = cache.get();
  if (!force && cached && Date.now() - cached.fetchedAt < TEN_MINUTES) {
    return cached;
  }

  const config = {};
  if (process.env.CURRENCY_API_KEY) {
    config.params = { access_key: process.env.CURRENCY_API_KEY };
  }

  const response = await axios.get(process.env.CURRENCY_API_URL, config);

  const rate = response.data?.rates?.EUR || response.data?.conversion_rates?.EUR;

  if (!rate) {
    throw new Error('Unable to parse exchange rate from API response');
  }

  cache.set(rate);
  logger.info('Exchange rate refreshed: %d', rate);
  return cache.get();
}

export async function getRates(req, res) {
  try {
    const data = await fetchRate(false);
    res.json(data);
  } catch (error) {
    const cached = cache.get();
    if (cached) {
      logger.warn('Currency API failed, returning cached rate: %o', error);
      res.json({ ...cached, stale: true });
    } else {
      res.status(502).json({ message: 'Failed to retrieve exchange rate' });
    }
  }
}

export async function refreshRate(req, res) {
  try {
    const data = await fetchRate(true);
    res.json(data);
  } catch (error) {
    res.status(502).json({ message: error.message });
  }
}

export { fetchRate };
