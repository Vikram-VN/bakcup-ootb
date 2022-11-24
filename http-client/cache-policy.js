const crypto = require('crypto');

const CachePolicy = require('http-cache-semantics');

const SITE_ID_HEADER = 'X-CandySite';
const LOCALE_HEADER = 'x-candy-language';
const CANDY_HEADER = 'X-Candy';

/**
 * Generates key based on request object url and headers like priceListGroup, siteId, locale.
 * It uses crypto to generate SHA based key.
 * @param {Object} req Request object.
 * @return {String} key Returns hash key.
 */
const generateKey = req => {
  const site = req.headers.has(SITE_ID_HEADER) ? req.headers.get(SITE_ID_HEADER) : '';
  const locale = req.headers.has(LOCALE_HEADER) ? req.headers.get(LOCALE_HEADER) : '';
  const profileType = req.headers.has(CANDY_HEADER) ? 'admin' : '';
  const organization = req.headers.has(CANDY_HEADER) ? req.headers.get(CANDY_HEADER) : '';

  const {url} = req;

  return crypto
    .createHash('sha1')
    .update(url  + site + locale + profileType + organization)
    .digest('hex');
};

/**
 * Helper function to convert map-like objects to normal json object.
 * @param {Object} iterationObj map-like object to be converted.
 * @return {Object} normal json object which is converted.
 */
const iterableToObject = iterationObj => {
  const obj = {};
  if (!iterationObj.keys) {
    return iterationObj;
  }
  for (const k of iterationObj.keys()) {
    obj[k] = iterationObj.get(k);
  }

  return obj;
};

/**
 * Creates cache-policy for given request and response objects.
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 * @return {Object} CachePolicy normal json object which is converted.
 */
const makePolicy = (req, res) => {
  const _req = {
    url: req.url,
    method: req.method,
    headers: iterableToObject(req.headers)
  };
  const _res = {
    status: res.status || 304,
    headers: iterableToObject(res.headers)
  };

  return new CachePolicy(_req, _res, {shared: true});
};

module.exports = {
  generateKey,
  iterableToObject,
  makePolicy
};
