const cacheManager = require('cache-manager');

const initCacheManager = options => {
  const memoryCache = cacheManager.caching({
    store: 'memory',
    max: options.cacheOptions.max,
    ttl: options.cacheOptions.ttl,
    shouldCloneBeforeSet: false
  });

  return memoryCache;
};

module.exports = initCacheManager;
