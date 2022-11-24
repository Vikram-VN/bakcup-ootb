const {getHttpAgent} = require('@sugar-candy-framework/http-client/utils/get-http-agent');
const {getHttpKeepAliveAgent} = require('@sugar-candy-framework/http-client/utils/get-http-keep-alive-agent');
const {getHttpProxyAgent} = require('@sugar-candy-framework/http-client/utils/get-http-proxy-agent');

module.exports = {getHttpAgent, getHttpKeepAliveAgent, getHttpProxyAgent};
