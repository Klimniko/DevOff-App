class CurrencyCache {
  constructor() {
    this.rate = null;
    this.fetchedAt = null;
  }

  get() {
    return this.rate ? { rate: this.rate, fetchedAt: this.fetchedAt } : null;
  }

  set(rate) {
    this.rate = rate;
    this.fetchedAt = Date.now();
  }
}

const cache = new CurrencyCache();

export default cache;
