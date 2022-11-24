
/*
 * This file was derived from https://github.com/mknj/node-keepalive-proxy-agent/blob/master/index.js which is under
 *
 * MIT License
 *
 * Copyright (c) 2018 mknj
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

const http = require('http');
const net = require('net');
const url = require('url');

class OccHttpProxyAgent extends http.Agent {
  constructor(options) {
    options = options || {};
    if (options.proxy === undefined) {
      let proxy = null;
      if (process.env.HTTP_PROXY !== undefined) {
        proxy = process.env.HTTP_PROXY;
      }
      if (process.env.http_proxy !== undefined) {
        proxy = process.env.http_proxy;
      }
      if (proxy) {
        proxy = proxy.toLowerCase().startsWith(`http`) ? proxy : `http://${proxy}`;
        const proxyUrl = new url.URL(proxy);
        options.proxy = {host: proxyUrl.hostname, port: proxyUrl.port || '80'};
      }
    }

    if (options.keepAlive === undefined) {
      options.keepAlive = true;
    }
    if (options.socketTimeOutMsecs === undefined) {
      options.socketTimeOutMsecs = 30000;
    }
    console.debug(`CFW proxy agent created options - ${JSON.stringify(options)}`);
    super(options);
  }

  addRequest(req, options) {
    const absolute = url.format({
      protocol: options.protocol || 'http:',
      hostname: options.hostname || options.host,
      port: options.port,
      pathname: req.path
    });
    req.path = decodeURIComponent(absolute);

    req.shouldKeepAlive = this.options.keepAlive;
    super.addRequest(req, options);
  }

  createProxiedConnection(options, cb) {
    const proxySocket = net.connect(options.proxy);

    const errorListener = error => {
      proxySocket.destroy();
      cb(error);
    };
    proxySocket.once('error', errorListener);

    proxySocket.setTimeout(options.socketTimeOutMsecs);
    proxySocket.on('timeout', () => {
      proxySocket.end();
    });

    options.socket = proxySocket;

    cb(null, proxySocket);
  }

  createConnection(options, cb) {
    if (options.proxy) {
      this.createProxiedConnection(options, cb);
    } else {
      cb(null, super.createConnection(options));
    }
  }
}
module.exports = OccHttpProxyAgent;
