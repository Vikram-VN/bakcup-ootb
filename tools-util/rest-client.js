const path = require('path');
const {___} = require('@sugar-candy-framework/tools-i18n').i18n({directory: path.join(__dirname, './locales')});
const fetch = require('@sugar-candy-framework/http-client');
const {squeeze} = require('./strings');
const endpoints = require('./auth-endpoints');

const refreshTokenInterval = 30000;

async function getResponseBody(originalResponse) {
  let body;
  const response = originalResponse.clone();
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.startsWith('application/json')) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  return body;
}
class ResponseError extends Error {
  constructor(options) {
    super(options.message);
    this.response = options.response;
    options.toString = this.toString();
  }

  toString() {
    const output = [];
    output.push(___`Response: `);
    output.push(___`Status: ${this.response.status}`);
    output.push(___`Url: ${this.response.url}`);
    const headers = [...this.response.headers].map(([key, values]) => `${key}: ${values}`);
    output.push(___`Headers: ${JSON.stringify(headers, null, 2)}`);
    console.error(output.join('\n'));
  }
}
/**
 * REST client for the OCCS Admin server.
 *
 * @class
 */
class Client {
  /**
   * Create a new OCCS Admin REST client instance.
   *
   * @param  {string}  baseURL                       The base URL, or hostname.
   * @param  {string}  appKey                        The application key obtained from OCCS Admin server.
   * @param  {Object}  [options={}]                  The options to modify the instance's default behavior.
   * @param  {number}  options.retries               Number of attempts to sign in after getting an error response.
   */
  constructor(baseURL, appKey, options = {}) {
    this.baseURL = baseURL.replace(new RegExp('/$'), '');
    this.appKey = appKey;
    this.accessToken = null;
    this.timer = null;
    this.stayLoggedIn = false;
    this.options = this.validateOptions(options);
    this.retries = options.retries === undefined ? 3 : this.options.retries;

    this.request = async (reqOptions = {}) => {
      const {body, ...restOfReqOptions} = reqOptions;
      const reqOpts = JSON.parse(JSON.stringify(restOfReqOptions));
      // Add the auth token if the client has one and one's not already present
      reqOpts.headers = reqOpts.headers || {};
      if (this.accessToken && !reqOpts.headers.Authorization) {
        reqOpts.headers.Authorization = `Bearer ${this.accessToken}`;
      }

      const response = await this.fetchRequest(baseURL, {body, ...reqOpts});

      return this.parseResponse(response, reqOpts.responseType);
    };

    this.rawRequest = async (reqOptions = {}) => {
      return this.fetchRequest(baseURL, reqOptions);
    };
  }

  /**
   * Process the request json and fetch
   *
   * @param  {string}  baseURL           The base URL, or hostname.
   * @param  {Object}  options           The request options.
   * @return {Object}  node-fetch Response class. See https://github.com/bitinn/node-fetch#class-response
   */
  async fetchRequest(baseURL, options) {
    let url = `${baseURL}${options.url}`;
    const {body, ...restOfReqOptions} = options;
    const requestOptions = JSON.parse(JSON.stringify(restOfReqOptions));
    delete requestOptions.url;
    delete requestOptions.responseType;

    // Append any query parameters to the end of the url
    if (requestOptions.params) {
      const queryParameters = Object.keys(requestOptions.params)
        .map(key => `${key}=${requestOptions.params[key]}`)
        .join('&');
      url += `?${queryParameters}`;
      delete requestOptions.params;
    }
    console.debug(`${(requestOptions.method || 'GET').toUpperCase()} ${url}`);

    return fetch(url, {body, ...requestOptions});
  }

  /**
   * Parse the response of node-fetch requests
   *
   * @param  {Object}  response        node-fetch Response class. See https://github.com/bitinn/node-fetch#class-response
   * @param  {string}  responseType    The expected response type (json | arraybuffer | strem | etc)
   * @return {Object}  Parsed server response.
   */
  async parseResponse(response, responseType) {
    // Convert the node-fetch Headers object into plain json
    const headers = {};
    if (response.headers) {
      for (const key of response.headers.keys()) {
        headers[key] = response.headers.get(key);
      }
    }

    let responseObject = {ok: response.ok, status: response.status, statusText: response.statusText, headers};
    let body;
    switch (responseType) {
      case Client.RESPONSE_TYPES.HTML:
        try {
          body = await response.text();
        } catch (parseerror) {
          console.debug(`Error parsing html response: ${parseerror}`);
        }
        responseObject.body = body;
        break;
      case Client.RESPONSE_TYPES.JSON:
        try {
          const contentLength = response.headers.get('Content-Length');
          if (contentLength !== '0') {
            if (response.ok) {
              body = await response.json();
            } else {
              // The response is an error condition - we may not have gotten JSON back as expected.
              // Get the text of the message so we can log it out if parsing fails, then try to parse it as JSON
              body = await response.text();
              body = JSON.parse(body);
            }
          } else {
            // An example of a request that gets an empty response is:
            // - Request: 'HEAD /candyAdmin/v1/registry/'
            // - Response: '200 OK', Headers: {'content-type': 'application/json'}
            body = '';
          }
        } catch (parseerror) {
          console.debug(`Error parsing json response: ${parseerror}`);
        }
        responseObject.body = body;
        break;
      case Client.RESPONSE_TYPES.BUFFER:
        try {
          body = await response.buffer();
        } catch (parseerror) {
          console.debug(`Error getting buffered response: ${parseerror}`);
        }
        responseObject.buffer = body;
        break;
      case Client.RESPONSE_TYPES.STREAM:
        responseObject.body = response.body;
        break;
      default:
        console.warn(`responseType ${responseType} not handled, returning the node-fetch response object unchanged.`);

        responseObject = response;
    }
    console.debug(responseObject);
    // Throw an error if response is not OK
    if (response.ok) {
      return responseObject;
    }

    const errorMsg =
      responseObject.body && responseObject.body.message
        ? responseObject.body.message
        : `${responseObject.status}: ${responseObject.statusText}`;
    const error = new Error(errorMsg);
    error.response = responseObject;
    console.debug(error);
    throw error;
  }

  /**
   * Validates the options received.
   *
   * Currently, it only looks at the `retries` property.
   *
   * @param   {Object}  options  The options object to validate.
   * @return  {Object}  A new validated options object.
   */
  validateOptions(options) {
    const validatedOptions = {...options};
    if (options.retries) {
      validatedOptions.retries = Number(options.retries);
      if (isNaN(validatedOptions.retries) || validatedOptions.retries < 0) {
        throw new Error(___`Invalid value 'options.retries: ${options.retries}'`);
      }
    }

    return validatedOptions;
  }

  /**
   * Attempts to obtain an authorization token from the OCCS Admin server.
   *
   * @param {Boolean} [stayLoggedIn=false] Whether the restClient should renew its token
   *    so it stays logged in. Internally, login calls startSession() if this is true.
   * - NOTE: if you set stayLoggedIn to true, you *must* explicitly call logout() at some point for the program to exit.
   * @return  {Promise}  Server response.
   */
  async login(stayLoggedIn, retriesLeft = this.retries) {
    const {path, ...options} = endpoints.login(this.appKey);

    const url = `${this.baseURL}${path}`;

    let response;
    try {
      response = await fetch(url, options);
    } catch (reason) {
      console.error(___`Admin login failed; reason: ${reason.message}.`);
      if (retriesLeft) {
        console.debug(___`Retrying Admin login.`);

        return this.login(stayLoggedIn, retriesLeft - 1);
      }
      throw reason;
    }

    if (response && response.ok) {
      const body = await response.clone().json();
      this.accessToken = body.access_token;
      console.debug(___`Got an Admin authorization token, value: '${squeeze(this.accessToken)}'`);
      if (stayLoggedIn) {
        this.stayLoggedIn = true;
        console.debug(___`Starting a session in Admin.`);
        this.startSession();
      }

      return response;
    }

    if (response && !response.ok) {
      let errorMessage;

      const errorBody = await getResponseBody(response);
      if (response.status === 401) {
        errorMessage = ___`Invalid application key.`;
      } else if (response.status === 400) {
        errorMessage = errorBody.message;
      } else {
        errorMessage = JSON.stringify(errorBody);
      }
      console.error(___`Error logging in the Admin server: ${errorMessage}`);
      console.debug(`Response: ${response.status} ${response.statusText}`);
      console.debug(JSON.stringify(errorBody));

      if (response.status === 401 || response.status === 400) {
        throw new ResponseError({message: ___`Unable to login to admin, status: ${response.status}`, response});
      }

      if (retriesLeft) {
        console.debug(___`Retrying login.`);

        return this.login(stayLoggedIn, retriesLeft - 1);
      }

      const error = new Error(`${response.statusText}: ${errorMessage}`);
      error.code = response.status;
      throw error;
    }

    // Normal runtime should not reach this point.
    return response;
  }

  /**
   * Refreshes the authorization token obtained from OCCS Admin.
   *
   * @return  {Promise}  Server response.
   */
  async refreshAuthorizationToken() {
    const {path, ...options} = endpoints.refresh(this.accessToken);
    const url = `${this.baseURL}${path}`;

    const response = await fetch(url, options);
    if (response.ok) {
      const body = await response.clone().json();
      this.accessToken = body.access_token;
    }

    return response;
  }

  /**
   * Starts a session on the OCCS Admin server.
   *
   * This methods renews automatically the authorization token.
   *
   * Note: The token expiration value on the refresh endpoint response is ignored.
   *
   */
  startSession() {
    this.timer = setInterval(async () => {
      try {
        const response = await this.refreshAuthorizationToken();
        if (response.ok) {
          console.debug(___`Refreshed Admin authorization token, new value: '${squeeze(this.accessToken)}'.`);
        } else {
          console.error(___`Error refreshing the authorization token from Admin.`);
          console.debug(`Response: ${response.status} ${response.statusText}`);
          console.debug(JSON.stringify(getResponseBody(response)));
          console.debug(___`Retrying Admin login.`);
          await this.login();
        }
      } catch (reason) {
        console.error(___`Error refreshing the authorization token from Admin, reason:`);
        console.error(reason);
        try {
          console.debug(___`Retrying Admin login.`);
          await this.login();
        } catch (reason) {
          console.error(___`Could not login back to Admin, reason:`);
          console.error(reason);
          console.debug(___`Will retry in the next ${refreshTokenInterval / 1000} seconds.`);
        }
      }
    }, refreshTokenInterval);
  }

  /**
   * Ends the session on the OCCS Admin server.
   *
   * @return  {Promise}  Server response.
   */
  async logout() {
    clearInterval(this.timer);
    console.debug(___`Logging out of Admin.`);
    const {path, ...options} = endpoints.logout(this.accessToken);
    const url = `${this.baseURL}${path}`;

    const response = await fetch(url, options);
    if (response.ok) {
      const body = await response.clone().json();
      this.accessToken = undefined;
      if (body.result !== true) {
        throw new Error(___`Error logging out of Admin, however token will not be renewed.`);
      }
    }

    return response;
  }
}

/**
 * Accepted response types by the Client when parsing responses.
 */
Client.RESPONSE_TYPES = {
  JSON: 'json',
  HTML: 'text/html',
  BUFFER: 'arraybuffer',
  STREAM: 'stream'
};

/**
 * Create a rest client object for making endpoint requests to the given server
 *
 * @param {String} serverUrl The base URL used for all requests made by the rest client.
 * @param {String} appKey If provided, the rest client will attempt to login using this application key. This
 *    value is typically used when the serverURL is the admin server since endpoint requests to
 *    admin must be authenticated by logging in first.
 * @param {Boolean} stayLoggedIn Whether the restClient should renew its token
 *    so it stays logged in. Default is false.
 * - NOTE: if you set stayLoggedIn to true, you *must* explicitly call logout() at some point.
 * @return  {Client}
 */
const createRestClient = async (serverUrl, appKey, stayLoggedIn = false) => {
  const restClient = new Client(serverUrl, appKey);
  if (appKey) {
    await restClient.login(stayLoggedIn);
  }

  return restClient;
};

/**
 * Create a rest client object for making endpoint requests to the given admin server.
 * The returned client will be logged into the admin server using the given two
 * factor credentials.
 *
 * @param {String} appServerAdmin The admin server URL used for all requests made by the rest client.
 * @param {String} username The username used for login.
 * @param {String} password The password used for login.
 * @param {String} code The two factor auth code used for login.
 * @return  {Client}
 */
const createMFARestClient = async (appServerAdmin, username = 'admin', password, code) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('username', username);
  params.append('password', password);
  params.append('totp_code', code);

  const restClient = new Client(appServerAdmin);

  const response = await restClient.request({
    method: 'post',
    url: `/candyAdminui/v1/mfalogin`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: Client.RESPONSE_TYPES.JSON,
    body: params
  });
  if (response.ok) {
    restClient.accessToken = response.body[`access_token`];
  }

  return restClient;
};

module.exports = {
  Client,
  createRestClient,
  createMFARestClient
};
