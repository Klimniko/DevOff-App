export const formatCurrency = (value, currency = 'EUR') =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);

export const formatNumber = (value, decimals = 2) => Number(value || 0).toFixed(decimals);
