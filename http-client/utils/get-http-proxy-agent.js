const url = require('url');
const HttpProxyAgent = require('http-proxy-agent');

let HttpsProxyAgent;
try {
  HttpsProxyAgent = require('https-proxy-agent');
} catch {
  console.debug('Failed to load https-proxy-agent normally - attempting to load index.js directly');
  HttpsProxyAgent = require('https-proxy-agent/dist');
}
const {Address4} = require('ip-address');

//These agents provide both proxy and keep alive support
const OccHttpProxyAgentWithKeepAlive = require('./cfw-http-proxy-keepalive-agent');
const OccHttpsProxyAgentWithKeepAlive = require('./cfw-https-proxy-keepalive-agent');

const {URL} = url;

const {env} = process;

const httpProxy = env.http_proxy || env.HTTP_PROXY || '';

const httpsProxy = env.https_proxy || env.HTTPS_PROXY || '';

// Split up and remove trailing space from the no proxy entries
const noProxyArray = (env.no_proxy || env.NO_PROXY || '').split(',').map(entry => entry.trim());

// eslint-disable-next-line spellcheck/spell-checker
/* Convert no proxy entries into Regex in case a URL doesn't match exactly.
 *
 * Map {
 *    'localhost' => /localhost$/,
 *    '*.oracle.com' => /[^\.]*\.oracle\.com$/,
 *    '.example.com' => /\.example\.com$/,
 *    '127.*.*.1' => /127\.[^\.]*\.[^\.]*\.1$/,
 *    '' => /$/
 *  }
 */
const noProxyRegexMap = new Map(
  noProxyArray.map(noProxyPattern => {
    const isIpAddress = val => /^[0-9]{1,3}/.test(val);
    let parsedPattern;
    // First check if the pattern references a standard IPv4 address (no '*')
    if (isIpAddress(noProxyPattern) && !noProxyPattern.includes('*')) {
      try {
        parsedPattern = new Address4(noProxyPattern || '');
      } catch (error) {
        console.log('Encountered error parsing IP address');
        console.log(error);
      }
    }
    // If the no proxy pattern wasn't a standard IPv4 address, coerce it to a regex
    if (!parsedPattern) {
      parsedPattern = new RegExp(
        noProxyPattern
          .replace(/\./g, '\\.') // Dots match exactly
          .replace(/\*/g, '[^\\.]*') // Asterisk act like [^.]*, so it matches .*.oracle.com
          .concat('$') // Match the end of the string (no xyz.co matching xyz.co.uk)
      );
    }

    return [noProxyPattern, parsedPattern];
  })
);

const isNoProxyUrl = url => {
  for (let noProxyPattern of noProxyArray) {
    noProxyPattern = noProxyPattern.trim();
    // If this noProxyPattern was white space, skip it.
    if (!noProxyPattern) continue;
    // If the noProxyPattern matches the domain exactly, return true
    if (url.host.includes(noProxyPattern)) {
      return true;
    }
    // It doesn't match exactly, check if it matches the Regex or IP mask
    const noProxyRegex = noProxyRegexMap.get(noProxyPattern);
    if (noProxyRegex instanceof RegExp && noProxyRegex.test(url.host)) {
      return true;
    }
    // And if the regex fails, try checking the IP sub-net mask
    try {
      if (noProxyRegex instanceof Address4 && new Address4(url.host || '').isInSubnet(noProxyRegex)) {
        return true;
      }
    } catch (error) {
      // Catch errors that occur - most of the time coercing url.host to an IP
      // address should just result in an Address4 object with invalid: true, which
      // won't match any IPs. But in case we encounter a fatal error here we
      // don't want to kill the whole request
      console.error(`Error checking if ${url.host} matches no proxy IP address`);
      console.error(error);
    }
  }

  return false;
};
let httpProxyAgent, httpsProxyAgent;

if (env.REVERT_AGENT) {
  //Switch to revert back to older agents instead, please remove
  //this in after couple of releases.
  httpProxyAgent = httpProxy ? new HttpProxyAgent(httpProxy) : undefined;
  httpsProxyAgent = httpsProxy ? new HttpsProxyAgent(httpsProxy) : undefined;
} else {
  httpProxyAgent = httpProxy ? new OccHttpProxyAgentWithKeepAlive() : undefined;
  httpsProxyAgent = httpsProxy ? new OccHttpsProxyAgentWithKeepAlive() : undefined;
}

const getHttpProxyAgent = (urlString, options) => {
  const url = new URL(urlString);
  if (isNoProxyUrl(url)) {
    return;
  }
  if (url.protocol === 'https:' && httpsProxyAgent) {
    if (options) {
      return new OccHttpsProxyAgentWithKeepAlive(options);
    }

    return httpsProxyAgent;
  }

  if (url.protocol === 'http:' && httpProxyAgent) {
    if (options) {
      return new OccHttpProxyAgentWithKeepAlive(options);
    }

    return httpProxyAgent;
  }
};

module.exports = {getHttpProxyAgent};
