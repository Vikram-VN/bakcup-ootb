/*global clearTimeout, setTimeout*/
/**
 * An Identity function return the value that was passed as an argument.
 *
 * @param {*} value
 * @returns {*} value
 */
export const identity = value => value;

/**
 * Do nothing.
 */
export const noop = () => {};

/**
 * Return an empty string `""`.
 *
 * @returns {String}
 */
export const getEmptyString = () => '';

/**
 * Determine if a given value is an Object (for this algorithm Arrays are not Objects).
 *
 * @param {*} value The value under test
 * @returns {Boolean} true if the value is an Object, false otherwise
 */
export const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);

/**
 * Determine if a given value is not an Object with one or more properties.
 *
 * @param {*} value The value under test
 * @return {Boolean} false if the value is an Object with one or more properties, true otherwise
 */
export const isEmptyObject = obj => {
  if (obj == null || typeof obj === 'string') {
    return true;
  }

  if (obj.keys !== 'undefined') {
    return Object.keys(obj).length === 0;
  }

  return true;
};

/**
 * Replace tokens with substitution variables, e.g.: `t('Hello __NAME__', {name: 'Joe'}) === 'Hello Joe'`
 *
 * @param {String} value The string to have it's tokens (if any) replaced
 * @param {Object} value The substitution variables
 * @return {String}
 */
export const t = (value, substitutions) => {
  if (value && substitutions) {
    for (const key in substitutions) {
      value = value.replace(new RegExp(`__${key}__`, 'gi'), substitutions[key]);
    }
  }

  return value;
};

/**
 * Converts an object of booleans into a CSS className string.
 * e.g.: `objToClassName({item: true, disabled: isTrue()}) === 'item disabled'`
 *
 * @param {Object} obj The css classes mapped to booleans
 * @return {String} a css className string to be passed into the html
 */
export const objToClassName = obj => {
  let className = '';
  if (typeof obj === 'object') {
    for (const key in obj) {
      if (obj[key]) {
        if (className) {
          className += ' ';
        }
        className += key;
      }
    }
  }

  return className;
};

/**
 * Maps the array element into an object like structure
 * @param {Object} array - input array
 * @param {string} key - name of the item property to be used as key in the object
 * @param {Function} transformObjectCallback - optional callback to transform each item in the array
 */
export const arrayToMap = (array, key, transformObjectCallback) => {
  const result = {};
  if (!array) {
    return result;
  }
  for (const item of array) {
    result[item[key]] = transformObjectCallback ? transformObjectCallback(item) : item;
  }

  return result;
};

/**
 * Returns the base url from the request or window object.
 * This will NOT include locale or site context.
 * When withoutProtocol flag is set to true, base url will be returned without the protocol part.
 *
 * @param  {Object} req request.
 * @param  {Object} window window
 * @param  {Boolean} withoutProtocol withoutProtocol flag
 * @return {String} base url
 */
export const getBaseURL = ({req, window, withoutProtocol}) => {
  // from node server
  if (req && req.get) {
    return `${withoutProtocol ? '' : `${req.protocol}:`}//${req.get('host')}${req.baseUrl}`;
  }
  // from browser
  if (window && window.location) {
    let baseUrl = `${withoutProtocol ? '' : window.location.protocol}//${window.location.host}`;
    if (window.siteBaseURLPath && window.siteBaseURLPath !== '/') {
      baseUrl += window.siteBaseURLPath;
    }

    return baseUrl;
  }

  return '';
};

/**
 * Ensure leading / and trailing / are present in pathname, e.g. "home" becomes "/home/".
 *
 * @param {String} pathname The original path to normalize
 * @return {String}
 */
export const normalizePath = pathname => `/${pathname.replace(/^\//, '').replace(/\/$/, '')}/`.replace('//', '/');

/**
 * Transforms search query string (part of URL) to the map of key value pairs
 *
 * @param {String} searchString
 * @returns map of key value pairs of query params present in search string
 */
export const searchStringToQueryParams = searchString => {
  if (!searchString || searchString.length === 0) {
    return {};
  }
  //Remove ? from start of string (if present)
  const modifiedSearchString = searchString.includes('?')
    ? searchString.slice(searchString.indexOf('?') + 1)
    : searchString;
  if (!modifiedSearchString || modifiedSearchString.length === 0) {
    return {};
  }
  const listOfQueryParams = modifiedSearchString.split('&');
  const queryParams = {};
  listOfQueryParams.forEach(item => {
    const [key, value] = item.split('=');
    queryParams[key] = value;
  });

  return queryParams;
};

/* Returns the uniqueId generated.
 *
 * @return {String} is the alphanumeric value
 */
export const uuid = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * function performs a deep merge of 2 objects, target and source.
 *
 * by default the merge is non destructive i.e. if there's a clash of keys between
 * the target object and the source, the target wins.
 *
 * this behavior may be altered by passing in override:true as an option.
 *
 * this is a non exhaustive merge, but should be adequate for merging basic objects together.
 *
 * @param {Object} target the target object to merge the source into.
 * @param {Object} source the object merged into the target.
 * @param {Object} opts options used when performing the merge.
 *
 * @returns {Object} the result of merging both objects.
 */
export const merge = (target, source, opts = {}) => {
  const options = {
    override: false,
    warn: false,
    source: 'unknown',
    ...opts
  };

  // 2 objects may require deep merging
  if (isObject(target) && isObject(source)) {
    for (const key of Object.keys(source)) {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(target, {[key]: source[key]});
        } else {
          target[key] = merge(target[key], source[key], options);
        }
      } else if (options.override || !target[key]) {
        Object.assign(target, {[key]: source[key]});
      }
    }
  } else if (Array.isArray(target) && Array.isArray(source)) {
    // for arrays, just add in non existing values to target from source.
    target = target.slice();

    for (const value of Object.values(source)) {
      if (!target.includes(value)) {
        target.push(value);
      }
    }
  }

  return target;
};
/* Returns boolean value for the args check.
 *  true if args are empty object and false otherwise.
 *
 * @return {boolean}
 */
export const argCheckForEmptyObjects = args => {
  return !isObject(args) || isEmptyObject(args) ? true : false;
};

export const debounce = (func, delay) => {
  let inDebounce;

  return function (event, data) {
    const myEvent = {...event};
    clearTimeout(inDebounce);
    inDebounce = setTimeout(func, delay, myEvent, data);
  };
};

export const throttle = (fn, delay) => {
  let inThrottle;

  const throttled = (...args) => {
    const func = () => {
      inThrottle = null;
      fn(...args);
    };
    if (inThrottle) {
      return;
    }
    inThrottle = setTimeout(func, delay);
  };

  return throttled;
};

/**
 * Method sorts the input array containing objects on a given input key
 * @param {*} array - array of objects to sort
 * @param {*} key - key to be used for sorting comparison
 */
export const sortArrayByKeyAsc = (array, key) => {
  array.sort((option1, option2) => {
    if (option1[key] < option2[key]) return -1;
    if (option1[key] > option2[key]) return 1;

    return 0;
  });
};

/**
 * Returns whether a value equates to
 *
 * Used to map checkbox string true into a boolean needed by the endpoint
 *
 * @param {object} value The value to test
 * @return {Boolean} Whether the value was true.
 */
export const valueIsTrue = value => {
  return value === true || value === 'true';
};

/**
 * Function to handle date format from server to browser
 * returns date in y yyy-mm-dd format
 */
export const formatDate = (dateVal = '') => {
  if (!dateVal) return '';
  const date = new Date(dateVal);
  let dateRes = '';
  if (date.toString() === 'Invalid Date') {
    dateRes = '';
  }
  dateRes = `${date.getFullYear()}-${`0${date.getMonth() + 1}`.slice(-2)}-${`0${date.getDate()}`.slice(-2)}`;

  return dateRes;
};
