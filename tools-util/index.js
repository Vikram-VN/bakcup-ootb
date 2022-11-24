const fs = require('fs-extra');
const path = require('path');
const endpoint = require('./endpoints');
const restclient = require('./rest-client');
const strings = require('./strings');
const deployment = require('./deployment');

const defaultAppsDir = 'packages/apps';

/**
 * Verifies synchronously a folder exists and can be read and written.
 *
 * An exception is thrown if the folder is not in a usable state.
 *
 * @param      {string}  path          The folder path to check.
 * @param      {string}  errorMessage  The error message. The default is 'Cannot access folder: ${path}'.
 */
function assertFolderExistSync(path, errorMessage) {
  try {
    /* eslint-disable-next-line no-bitwise */
    fs.accessSync(path, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
  } catch (err) {
    throw new Error(errorMessage || `Cannot access folder: ${path}`);
  }
}

const getApplicationDir = appName => {
  return path.join(defaultAppsDir, appName);
};

/**
 * Converts a value to Boolean.
 *
 * This method is intended to interpret System Environment variables correctly.
 * It expects the input data type to be either _String_, _Number_, or _Boolean_.
 * Other types are considered as `undefined`.
 * Up to some extent, it also tries to mimic the `truthy`, `falsy` interpretations.
 * E.g., these values stick to the common truthy and falsy interpretation:
 * ```
 * // Falsy: false, 0, ''
 * // Truthy: true, 1, -3, 0.1, 'true', ' true ', '1'
 * resolveBoolean(''); // Returns `false`
 * resolveBoolean(0);  // Returns `false`
 * resolveBoolean(1);  // Returns `true`
 * ```
 * but these are contrary to the common truthy interpretation:
 * ```
 * resolveBoolean('false'); // Returns `false`
 * resolveBoolean('0');     // Returns `false`
 * resolveBoolean('car');   // Returns `undefined`
 * resolveBoolean({});      // Returns `undefined`
 * ```
 *
 * @param  {(string|number|boolean)}  value   The value to convert.
 * @return {boolean}  The boolean value, or `undefined` if `value` is unusual.
 */
function resolveBoolean(value) {
  switch (typeof value) {
    case 'number':
    case 'bigint':
      return Boolean(value);

    case 'string': {
      const text = value.trim();
      if (!Number.isNaN(parseInt(text, 10))) {
        return Boolean(parseInt(text, 10));
      }

      switch (text.toLowerCase()) {
        case '':
        case 'false':
          return false;
        case 'true':
          return true;
        default:
          return;
      }
    }

    case 'boolean':
      return value;

    default:
  }
}

module.exports = {
  endpoint,
  restclient,
  strings,
  deployment,
  assertFolderExistSync,
  defaultAppsDir,
  getApplicationDir,
  resolveBoolean
};
