const http = require('http');
const https = require('https');

const OPTIONS = {keepAlive: true};

const httpsKeepAliveAgent = new https.Agent(OPTIONS);

const httpKeepAliveAgent = new http.Agent(OPTIONS);

const getHttpKeepAliveAgent = (urlString, options) => {
  const url = new URL(urlString);

  if (url.protocol === 'https:' && httpsKeepAliveAgent) {
    if (options) {
      const mergedoptions = {...OPTIONS, ...options};

      return new https.Agent(mergedoptions);
    }

    return httpsKeepAliveAgent;
  }

  if (url.protocol === 'http:' && httpKeepAliveAgent) {
    if (options) {
      const mergedoptions = {...OPTIONS, ...options};

      return new http.Agent(mergedoptions);
    }

    return httpKeepAliveAgent;
  }
};

module.exports = {getHttpKeepAliveAgent};
