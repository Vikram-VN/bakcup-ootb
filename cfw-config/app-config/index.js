module.exports = {
  cacheEnabled: true, // whether to enable cache or not
  cacheOptions: {
    validityPeriod: 2 * 60 * 1000, // validity period of the req to be in cache. If expired, the request goes to CFW for re-validation.
    ttl: 30 * 60, // if expired, the response against respective request stored in cache gets removed.
    max: 99999, // maximum objects to be stored in the cache.
    cacheableUrlPatterns: {
      // url patterns for which the urls should be cached. If the url doesn't fall under any of these, it is not cache-able.
      default: {
        urlPatterns: [
          '/candyWeb/v1'
        ]
      }
    }
  }
};
