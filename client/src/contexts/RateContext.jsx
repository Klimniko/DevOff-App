import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import currencyService from '../services/currencyService';
import { toast } from 'react-toastify';

const RateContext = createContext();
const TEN_MINUTES = 10 * 60 * 1000;

export function RateProvider({ children }) {
  const [rate, setRate] = useState(null);
  const [timestamp, setTimestamp] = useState(null);
  const [loading, setLoading] = useState(false);
  const cacheRef = useRef(null);

  const fetchRate = useCallback(async (options = { force: false }) => {
    if (!options.force && cacheRef.current && Date.now() - cacheRef.current.timestamp < TEN_MINUTES) {
      const cached = cacheRef.current;
      setRate(cached.rate);
      setTimestamp(cached.timestamp);
      return cached.rate;
    }

    setLoading(true);
    try {
      const data = options.force ? await currencyService.refresh() : await currencyService.getRate();
      setRate(data.rate);
      setTimestamp(data.fetchedAt);
      cacheRef.current = { rate: data.rate, timestamp: data.fetchedAt };
      return data.rate;
    } catch (error) {
      toast.error(error.message || 'Failed to fetch exchange rate');
      if (cacheRef.current) {
        setRate(cacheRef.current.rate);
        setTimestamp(cacheRef.current.timestamp);
        return cacheRef.current.rate;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate().catch((error) => console.error('Initial rate fetch failed', error));
    const interval = setInterval(() => {
      fetchRate({ force: true }).catch((error) => console.error('Scheduled rate refresh failed', error));
    }, TEN_MINUTES);
    return () => clearInterval(interval);
  }, [fetchRate]);

  const value = useMemo(() => ({ rate, timestamp, loading, refresh: () => fetchRate({ force: true }) }), [rate, timestamp, loading, fetchRate]);

  return <RateContext.Provider value={value}>{children}</RateContext.Provider>;
}

RateProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export function useRate() {
  const context = useContext(RateContext);
  if (!context) {
    throw new Error('useRate must be used within a RateProvider');
  }
  return context;
}
