const {getHttpKeepAliveAgent} = require('@sugar-candy-framework/http-client/utils/get-http-keep-alive-agent');
const {getHttpProxyAgent} = require('@sugar-candy-framework/http-client/utils/get-http-proxy-agent');

const getHttpAgent = (urlString, options) => {
  const agent = getHttpProxyAgent(urlString, options) || getHttpKeepAliveAgent(urlString, options);

  return agent;
};

module.exports = {getHttpAgent};
