const https = require('https');
const net = require('net');
const url = require('url');

class OccHttpsProxyAgent extends https.Agent {
  constructor(options) {
    options = options || {};
    if (options.proxy === undefined) {
      let proxy = null;
      if (process.env.HTTPS_PROXY !== undefined) {
        proxy = process.env.HTTPS_PROXY;
      }
      if (process.env.https_proxy !== undefined) {
        proxy = process.env.https_proxy;
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

  createProxiedTunnel(options, cb) {
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

    let response = '';
    const dataListener = data => {
      response += data.toString();
      if (!response.endsWith('\r\n\r\n')) {
        return;
      }
      proxySocket.removeListener('error', errorListener);
      proxySocket.removeListener('data', dataListener);

      const m = response.match(/^HTTP\/1.\d+ (\d*)/);
      if (m == null || m[1] == null) {
        proxySocket.destroy();

        return cb(new Error(response.trim()));
      }
      if (m[1] !== '200') {
        proxySocket.destroy();

        return cb(new Error(m[0]));
      }
      options.socket = proxySocket;
      cb(null, super.createConnection(options));
    };
    proxySocket.on('data', dataListener);

    let cmd = `CONNECT ${options.hostname}:${options.port} HTTP/1.1\r\n`;
    if (options.proxy.auth) {
      const auth = Buffer.from(options.proxy.auth).toString('base64');
      cmd += `Proxy-Authorization: Basic ${auth}\r\n`;
    }
    cmd += '\r\n';
    proxySocket.write(cmd);
  }

  createConnection(options, cb) {
    if (options.proxy) {
      this.createProxiedTunnel(options, cb);
    } else {
      cb(null, super.createConnection(options));
    }
  }
}

module.exports = OccHttpsProxyAgent;
