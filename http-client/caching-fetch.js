/* eslint-disable no-useless-escape */

const {Request} = require('node-fetch');
const fetch = require('./index');
const cacheManager = require('./cache');
const {makePolicy, iterableToObject} = require('./cache-policy');

/**
 * A function that returns whether the url is cache-able or not based on the white-listed urls from app config.
 * @param {String} req request to be checked for cache-able or not.
 * @param {Object} patterns cache-able url patterns which contain urls that needs to be included.
 * @return {Boolean} returns whether url can be cached or not.
 */
const isCacheableUrl = (req, patterns) => {
  const url = new URL(req.url);

  if (req.method && req.method !== 'GET') {
    return false;
  }
  if (patterns.default && patterns.default.urlPatterns) {
    //default is the grouping tag and for now this is hard-coded.
    const {urlPatterns} = patterns.default;

    return Boolean(urlPatterns.find(path => url.pathname.startsWith(path)));
  }

  return false;
};

/**
 * A wrapper written around http-client fetch to store the response into cache based on certain rules.
 * @param {Object} req fetch Request for cc-server
 * @param {Object} options custom options like headers, method, etc., to be sent to cc-server
 * @return {Object} res response from cc-server
 */
const cachingFetch = async (req, options = {}, appConfig) => {
  const response = await fetch(req, options);
  // need to check if the response ca be store in the cache or not based on response headers
  if (
    (req.method === 'GET' || req.method === 'HEAD') &&
    makePolicy(req, response).storable() &&
    response.status === 200
  ) {
    const res = await cacheManager.setResponse(req, response, appConfig);

    return res;
  }

  return response;
};

/**
 * Returns cached response after validating the corresponding request with server.
 * @param {Object} req fetch Request for cc-server
 * @param {Object} options custom options like headers, method, etc., to be sent to cc-server
 * @param {Object} cachedResponse response from cache for corresponding request.
 * @return {Object} res response from cc-server
 */
const validateCachedResponse = (req, options = {}, cachedResponse, appConfig) => {
  const policy = makePolicy(req, cachedResponse);
  req.headers = policy.revalidationHeaders(req);

  return cachingFetch(req, options, appConfig).then(async condRes => {
    const revalidatedPolicy = policy.revalidatedPolicy(req, {
      status: condRes.status,
      headers: iterableToObject(condRes.headers)
    });

    if (condRes.status === 304) {
      const newHeaders = revalidatedPolicy.policy.responseHeaders();
      for (const [key, val] of Object.entries(newHeaders)) {
        condRes.headers.set(key, val);
      }
      const res = await cacheManager.setResponse(req, condRes, appConfig);

      return res;
    }

    return condRes;
  });
};

/**
 * Decides whether to return cachedResponse or cachingFetch.
 * @param {Object} req fetch Request for cc-server
 * @param {Object} options custom options like headers, method, etc., to be sent to cc-server
 * @return {Object} res response from cc-server
 */
const cachedFetch = async (req, options = {}, appConfig) => {
  req = req instanceof Request ? req : new Request(req, options);

  if (!isCacheableUrl(req, appConfig.cacheOptions.cacheableUrlPatterns)) {
    return fetch(req, options);
  }

  const cachedResponseObject = await cacheManager.getResponse(req, appConfig);
  if (cachedResponseObject && cacheManager.isResponseExpired(cachedResponseObject, appConfig)) {
    return validateCachedResponse(req, options, cachedResponseObject, appConfig);
  }
  if (cachedResponseObject) {
    return cachedResponseObject;
  }

  return cachingFetch(req, options, appConfig);
};

const createCachingFetch = app => (req, options) => {
  const appConfig = app.locals.options;
  if (appConfig.cacheEnabled && appConfig.cacheManager) {
    return cachedFetch(req, options, appConfig);
  }

  return fetch(req, options);
};

module.exports = createCachingFetch;
