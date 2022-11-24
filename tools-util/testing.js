const {spawn} = require('child_process');
const {createRestClient} = require('./rest-client');

//Runs the given command line tool with the given arguments.
//requiredPromptsAndResponses can optionally be provided. These are the required
//prompts and their associated responses that must be received before the cli terminates. otherwise,
//an error is returned.
const runScript = (command, args = [], requiredPromptsAndResponses = []) => {
  console.log(`Running runScript with ${command}, ${args}`);
  console.log(`runScript requiredPromptsAndResponses are ${JSON.stringify(requiredPromptsAndResponses)}`);
  let scriptOutput = '';
  let scriptError = '';

  return new Promise(resolve => {
    const child = spawn(command, args, {
      shell: true,
      env: process.env
    }).on('exit', function (code) {
      //were there any expected prompts that we didn't get?
      if (requiredPromptsAndResponses && requiredPromptsAndResponses.length > 0) {
        for (let i = 0; i < requiredPromptsAndResponses.length; i++) {
          // eslint-disable-next-line prefer-destructuring
          if (requiredPromptsAndResponses[i].received === undefined) {
            console.error(
              `Prompt "${requiredPromptsAndResponses[i].prompt}" was expected for but not received from the the cli.`
            );
            code = 1;
          }
        }
      }
      resolve({code, scriptOutput, scriptError});
    });

    //this works better than using stdio.inherit above. otherwise console logging from
    //jest interferes with the rendering of command line output from the test
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);

    //save all the console logging in a buffer that is returned and
    //then can be scanned for other problems.
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
      data = data.toString();
      //if we are expecting prompts, check and reply with
      //response
      if (requiredPromptsAndResponses && requiredPromptsAndResponses.length > 0) {
        for (let i = 0; i < requiredPromptsAndResponses.length; i++) {
          // eslint-disable-next-line prefer-destructuring
          if (data.startsWith(requiredPromptsAndResponses[i].prompt)) {
            process.nextTick(() => {
              child.stdin.write(`${requiredPromptsAndResponses[i].response}\n`);
              child.stdin.end();
            });
            //remember that we successfully got the prompt and responded
            requiredPromptsAndResponses[i].received = true;
          }
        }
      }
      scriptOutput += data;
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function (data) {
      data = data.toString();
      scriptError += data;
    });
  });
};

const BASIC_AUTH_USER = process.env.OCC_BASIC_AUTH_USER || process.env.BASIC_AUTH_USER || 'admin';
const BASIC_AUTH_PASS = process.env.OCC_BASIC_AUTH_PASS || process.env.BASIC_AUTH_PASS || 'admin';
//this property provides the basic auth header
const basicAuthHeaders = {
  //credentials used for basic auth testing
  // eslint-disable-next-line new-cap
  Authorization: `Basic ${new Buffer.from([BASIC_AUTH_USER, BASIC_AUTH_PASS].join(':')).toString('base64')}`
};

/*
 * Makes a request to preview for a given page and returns the response.
 * First logs into admin to acquire the auth token. Then
 * makes request to preview host using the secret cookie
 * (containing the admin auth token).
 *
 */
const fetchPreview = async (args = {}, config = {}) => {
  const {
    page = 'home',
    appPreviewUrl = config.appPreviewUrl,
    appServerAdmin = config.appServerAdmin,
    appKey = config.appKey,
    clusterName = 'storefront',
    overrideHeaders = undefined
  } = args;

  const previewRequestPath = `/occ-preview/${clusterName}/${page}`;
  console.log(`Running fetchPreview with ${page}, ${appPreviewUrl}, ${appServerAdmin}, ${appKey}, ${clusterName}`);
  console.log(`Running fetchPreview with previewPage ${previewRequestPath}`);
  const previewClient = await createRestClient(appPreviewUrl);
  const restClient = await createRestClient(appServerAdmin, appKey);

  const headers = {
    'Content-Type': 'application/json',
    'X-CCAsset-Language': 'en',
    Cookie: `oauth_token_secret-adminUI=${restClient.accessToken}`,
    ...overrideHeaders
  };
  console.log(`Running fetchPreview with ${page}, ${previewRequestPath}, ${JSON.stringify(headers)}`);

  const response = await previewClient.request({
    method: 'get',
    url: `${previewRequestPath}`,
    headers,
    responseType: 'text/html'
  });

  return response;
};

//makes a request to the storefront for a given page. The response is returned.
const fetchStorefront = async (args = {}, config = {}) => {
  const {
    page = 'home',
    storefrontUrl = config.storefrontUrl,
    sendBasicAuth = true,
    overrideHeaders = undefined,
    requestPath
  } = args;

  const restClient = await createRestClient(storefrontUrl);
  let headers = overrideHeaders || {
    'Content-Type': 'application/json',
    'X-CCAsset-Language': 'en'
  };
  if (sendBasicAuth) {
    headers = {
      ...headers,
      ...basicAuthHeaders
    };
  }
  console.log(`Running fetchStorefront with ${page}, ${storefrontUrl}, ${JSON.stringify(headers)}`);
  const liveRequestPath = requestPath ? requestPath : `/${page}`;
  console.log(`Running fetchStorefront with liveRequestPath ${liveRequestPath}`);

  const response = await restClient.request({
    method: 'get',
    url: liveRequestPath,
    headers,
    responseType: 'text/html'
  });

  return response;
};

/*
 * Makes page request to a locally running app server and returns response.
 */
const fetchLocal = async (args = {}) => {
  const {page = 'home', sendBasicAuth = true, overrideHeaders = undefined} = args;
  const localClient = await createRestClient('http://localhost:2020');
  let headers = overrideHeaders || {
    'Content-Type': 'application/json',
    'X-CCAsset-Language': 'en'
  };
  //add the basic auth header
  if (sendBasicAuth) {
    headers = {
      ...headers,
      ...basicAuthHeaders
    };
  }
  console.log(`Running fetchLocal with ${page} ${JSON.stringify(headers)}`);
  const response = await localClient.request({
    method: 'get',
    url: page.startsWith('/') ? page : `/${page}`,
    headers,
    responseType: 'text/html'
  });

  return response;
};

/**
 * Get the cluster id that has the given app referenced by its applicationId
 */
const getClusterForApp = async (args = {}, config = {}) => {
  const {appName, appServerAdmin = config.appServerAdmin, appKey = config.appKey} = args;
  console.log(`Running getClusterForApp with ${appName}, ${appServerAdmin},${appKey}`);
  const restClient = args.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/deploymentEnvironment`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });
  const payload = response.body;
  const clusters = payload.items;
  for (const cluster of clusters) {
    if (cluster.applicationId === appName) {
      return cluster.repositoryId;
    }
  }
};

/**
 * Sets the applicationId and liveApplicationId to null on the given cluster
 * By doing this, it makes the eligible to have an application deployed to them.
 */
const makeClusterAvailableForDeploy = async (args = {}, config = {}) => {
  const {clusterId = 'storefront', appServerAdmin = config.appServerAdmin, appKey = config.appKey} = args;
  console.log(`Running makeClusterAvailableForDeploy with ${appServerAdmin}, ${clusterId}`);
  const restClient = args.restClient || (await createRestClient(appServerAdmin, appKey));
  let response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/deploymentEnvironment/${clusterId}`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  const payload = response.body;
  delete payload.liveApplicationId;
  delete payload.repositoryId;
  delete payload.applicationId;
  delete payload.links;

  response = await restClient.request({
    method: 'delete',
    url: `/candyAdmin/v1/deploymentEnvironment/${clusterId}`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  response = await restClient.request({
    method: 'post',
    url: `/candyAdmin/v1/deploymentEnvironment`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json',
    body: JSON.stringify(payload)
  });
};

module.exports = {
  runScript,
  basicAuthHeaders,
  fetchLocal,
  fetchPreview,
  fetchStorefront,
  getClusterForApp,
  makeClusterAvailableForDeploy
};
