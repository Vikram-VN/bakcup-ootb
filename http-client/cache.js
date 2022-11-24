const {generateKey} = require('./cache-policy');

/**
 * Gets response stored in the cache against request.
 * @param {Object} req request obj
 * @param {Object} options custom options like to cache to be used while fetching response.
 * @return {Object} res response from cache
 */
const getResponse = async (req, options) => {
  const key = generateKey(req);
  const value = await options.cacheManager.get(key);

  return value;
};

/**
 * Sets response in the cache against request.
 * @param {Object} req request obj
 * @param {Object} res response obj to be stored
 * @param {Object} options custom options like to cache to be used while fetching response.
 * @return {Object} res response from cache
 */
const setResponse = async (req, response, options) => {
  if (response.status === 304) {
    const cacheResponse = await getResponse(req, options);
    cacheResponse.headers = response.headers;
    response = cacheResponse;
  } else if (response.status === 200) {
    const contentTypePattern = /(application\/json)/g;
    // If there's no content-type header or it isn't of type 'application/json', don't cache it
    if (!response.headers.get('content-type') || !response.headers.get('content-type').match(contentTypePattern)) {
      return response;
    }
    const jsonObj = await response.json();
    response.json = async () => jsonObj;
    response.text = async () => JSON.stringify(jsonObj);
  }
  response.entryDate = Date.now();
  const key = generateKey(req);
  options.cacheManager.set(key, response);

  return response;
};

const isResponseExpired = (response, options) => {
  return Date.now() - response.entryDate > options.cacheOptions.validityPeriod;
};

module.exports = {
  getResponse,
  setResponse,
  isResponseExpired
};
