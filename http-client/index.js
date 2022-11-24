const {default: _fetch, Request} = require('node-fetch');
const {getHttpAgent} = require('@sugar-candy-framework/http-client/utils');

const pathNormalizations = [
  // Remove query terms
  [/\?.*/, ''],
  // Truncate the path to three elements.
  // For example, '/candyWeb/v1/products/123' will be recorded as '/candyWeb/v1/products/#path'.
  [new RegExp('(/candyWeb/v1/[^/]+/).+'), '$1#path']
];

const stopTimer = (request, response, end) => {
  if (request && response && end) {
    let {url} = request;
    if (response.ok) {
      url = pathNormalizations.reduce((result, [pattern, replacement]) => result.replace(pattern, replacement), url);
    } else {
      const {origin} = new URL(url);
      url = `${origin}/#path`;
    }

    // Observes the value to xhrRequests duration in seconds.
    end({
      /* eslint-disable-next-line camelcase */
      status_code: response.status,
      method: request.method || 'GET',
      url
    });
  }
};

const startTimer = () => {
  const metrics = global.cfwMetrics;

  if (metrics && metrics.client) {
    return metrics.bagOfMetrics.externalRequestDurationInSeconds.startTimer();
  }
};

const fetch = async (url, options = {}) => {
  let request;
  let response;
  let end;

  try {
    request = url instanceof Request ? url : new Request(url, options);

    request.agent = getHttpAgent(request.url, options.httpAgentOptions);

    end = startTimer();

    response = await _fetch(request);

    if (process.env.STOREUI_LOG_LEVEL === 'debug' || process.env.CLI_LOG_LEVEL === 'debug') {
      console.debug(
        `(cfw TO CFW REQUEST) ${response.status} -> fetch({\n\tmethod: "${request.method}",\n\turl: "${
          request.url
        }",\n\theaders: ${JSON.stringify(request.headers.raw())}}})`
      );
    }

    return response;
  } catch (error) {
    if (request && process.env.DISABLE_REQUEST_LOG !== 'true') {
      console.error(
        `(cfw TO CFW REQUEST ERROR) fetch({\n\tmethod: "${request.method}",\n\turl: "${
          request.url
        }",\n\theaders: ${JSON.stringify(request.headers.raw())}}})`
      );
    }

    throw error;
  } finally {
    stopTimer(request, response, end);
  }
};

module.exports = fetch;
