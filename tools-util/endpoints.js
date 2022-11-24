const {createRestClient, createMFARestClient, Client} = require('./rest-client');

/**
 * Fetches deployment environment meta-data by id.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    clusterId (required) the deployment environment id
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The received endpoint response.
 */
const getDeploymentEnvironment = async options => {
  const {clusterId, appServerAdmin, appKey} = options;
  try {
    const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
    const response = await restClient.request({
      method: 'get',
      url: `/candyAdmin/v1/deploymentEnvironment/${clusterId}`,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CCAsset-Language': 'en'
      },
      responseType: 'json'
    });

    return response.body;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      throw error;
    }
  }
};

/**
 * Fetches deployment environments meta-data.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The received endpoint response.
 */
const getDeploymentEnvironments = async options => {
  const {appServerAdmin, appKey} = options;
  try {
    const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
    const response = await restClient.request({
      method: 'get',
      url: `/candyAdmin/v1/deploymentEnvironment/`,
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'X-CCAsset-Language': 'en'
      },
      responseType: 'json'
    });

    return response.body;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      throw error;
    }
  }
};

/**
 * Fetches a deployment by id.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    deployId (required) the deployment id.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The received endpoint response.
 */
const downloadDeploymentById = async options => {
  const {deployId, appServerAdmin, appKey} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/applicationDeployment/${deployId}`,
    responseType: 'stream'
  });

  return response;
};

/**
 * Fetches the current deployment for an application.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appName (required) the application id.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    preview (optional) determines if the current deployment is returned from live or preview.
 *      preview is the default.
 * @return  {Object} The streamed endpoint response.
 */
const downloadCurrentAppDeployment = async options => {
  const {appName, appServerAdmin, appKey, preview} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/clientApplications/${appName}/currentDeployment`,
    params: {preview},
    responseType: 'stream'
  });

  return response;
};

/**
 * Post an application deployment.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    packagedApp (required) The deployment zip binary.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    replaceApplication application to be replaced in the hosted environment (cluster)
 * @return  {Object} The endpoint response.
 */
const deployApplication = async options => {
  const {appName, appServerAdmin, appKey, packagedApp, replaceApplication} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const deployParams = {verbose: options.verbose, replaceApplication, ...options.deployParams};
  const response = await restClient.request({
    method: 'post',
    url: `/candyAdmin/v1/clientApplications/${appName}`,
    params: deployParams,
    headers: {
      'Content-Type': 'application/octet-stream',
      'X-CCAsset-Language': 'en'
    },
    body: packagedApp,
    responseType: 'json',
    /*
     * 10 minute timeout for deploy because it can take that
     * long to process the uploaded deployment in Design Studio
     *
     * note this only affects the timeout when deploying through
     * an http proxy.
     */
    httpAgentOptions: {socketTimeOutMsecs: 600000}
  });

  return response;
};

/**
 * Deletes an application from CFW preview.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appName (required) The application id to be deleted.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The endpoint response.
 */
const deleteApplication = async options => {
  const {appName, appServerAdmin, appKey} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'delete',
    url: `/candyAdmin/v1/clientApplications/${appName}`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Fetches the deployment logs from the node sandbox.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    reqAction (optional)
 *    reqParams (optional). Params supported are:
 * format - 'zip' for fetching zipped content
 * preview - true/false preview of live logs
 * syslog  - true/false fetch system logs (as opposed to application logs)
 * since - Query the deployment log beginning at a specific date. Format is MM-DD-YYYY HH:MM:SS
 * until - Query the deployment log ending at a specific date. Format is MM-DD-YYYY HH:MM:SS
 * queryText - Query the messages in the deployment log for specific text.
 * limit - Limit the results to a specific number of lines.
 * loggingLevel - Query the deployment log for messages at only the given level. Valid levels are error, warn, info, verbose or debug.
 * order - Specify the order the log results are returned, either ascending or descending. Valid values are asc or desc.
 * label - Query the log for entries matching the given label value.
 * includeArchives - Query the deployment log including the given number of archived logs.
 *
 * @return  {Object} The endpoint response.
 */
const getDeploymentLog = async options => {
  const {appServerAdmin, appKey, reqParams = {}, reqAction, id} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/${reqAction}/${id}/logs`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: reqParams.format !== 'zip' ? 'json' : 'arraybuffer',
    params: reqParams
  });

  return response;
};

/**
 * Fetches the current publishing status.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The endpoint response.
 */
const getPublishStatus = async options => {
  const {appServerAdmin, appKey} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await restClient.request({
    method: 'get',
    url: '/candyAdmin/v1/publish?lastPublished=true',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Gets publishing details (including the change id) for an assetId matching the appName.
 * The response body will contain a list of items with assetIds matching the appName. Those
 * items also have changeIds which can be included in a publishing change list.
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    appName (REQUIRED) the name of the assetId to be returned (usually the app name)
 */
const getAppPublishChange = async options => {
  const {appServerAdmin, appKey, appName} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  return restClient.request({
    method: 'get',
    url: '/candyAdmin/v1/publishingChanges',
    params: {
      q: `assetId eq "${appName}"`
    },
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: Client.RESPONSE_TYPES.JSON
  });
};

/**
 * Gets a publishing changeListId of a change list which includes the item IDs in
 * options.changeItemIds. That changeListId can then be published.
 *
 * @param {*} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    changeItemIds (REQUIRED) an array of publishing changes (changeIds) to be included in the publish
 */
const getChangeList = async options => {
  const {appServerAdmin, appKey, changeItemIds} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  return restClient.request({
    method: 'post',
    url: '/candyAdmin/v1/publishingChangeLists',
    body: JSON.stringify({changeItemIds}),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: Client.RESPONSE_TYPES.JSON
  });
};

/**
 * Gets a information on changes to be published as dependencies of the changes in a given
 * changeList. Limited to just 40 changes by default to keep the response a reasonable length.
 * Returns the JSON response, which contains dependency information on <returnObject>.body
 *
 * @param {*} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    changeListId (REQUIRED) the ID of a change list whose dependencies should be fetched
 *    limit (optional, default: 40) the number of dependency items on which to get detailed info
 */
const getChangeListDependencies = async options => {
  const {appServerAdmin, appKey, changeListId, limit} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  return restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/publishingChangeLists/${changeListId}?limit=${limit || 40}&changes=dependencies`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: Client.RESPONSE_TYPES.JSON
  });
};

/**
 * Triggers a publish. If operationType and changeListId aren't provided, the publish
 * is of all assets. If operationType is "selective_publish" and a changeListId is
 * provided, just the changes which are included in that change list are published.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    operationType (optional) type of publish (publish, full_publish, or selective_publish)
 *    changeListId (optional) the id of the change list to be published
 *    eventName (optional) a name under which the publishing event should be logged.
 * @return  {Object} The endpoint response.
 */
const publish = async options => {
  const {appServerAdmin, appKey, operationType, changeListId, eventName} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await restClient.request({
    method: 'post',
    url: '/candyAdmin/v1/publishingChangeLists/publish',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    // If none of the below values are provided, the result will be '{}', triggering a full publish
    body: JSON.stringify({operationType, changeListId, eventName}),
    responseType: 'json'
  });

  return response;
};

/**
 * Returns the list of changes staged for publish
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The endpoint response.
 */
const getPublishingChanges = async options => {
  const {appServerAdmin, appKey} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await restClient.request({
    method: 'get',
    url: '/candyAdmin/v1/publishingChanges',
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Triggers a redeploy of the current live or preview deployment on a cluster.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    clusterName (required) The deployment environment id for which the redeploy is triggered.
 *    preview (optional) true/false Determines if the preview or live deployment is redeployed.
 *    force (optional) true/false Determines if the redeploy will force the deployment to controllers that already
 * running it.
 * @return  {Object} The endpoint response.
 */
const redeploy = async options => {
  const {appServerAdmin, appKey, clusterName, preview = true, force = false} = options;

  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await restClient.request({
    method: 'post',
    url: `/candyAdmin/v1/deploymentEnvironment/${clusterName}/redeploy`,
    params: {preview, force},
    headers: {
      'Content-Type': 'application/json; charset=UTF-8'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Post a change to the deployment logging configuration on a cluster.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    clusterName (optional) Default is 'storefront' The deployment environment id for which the redeploy is triggered.
 *    preview (optional) true/false . Default is true. Determines if the preview or live deployment is redeployed.
 *    appLogLevel (optional) error/info/debug Sets the application logging level to this.
 *    systemLogLevel (optional) error/info/debug Sets the application logging level to this.
 * @return  {Object} The endpoint response.
 */
const setLoggingConfig = async options => {
  const {appServerAdmin, appKey, clusterName, appLogLevel, systemLogLevel, preview = true, debugMode} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  // turn the specified options into POST data
  const postData = {};
  if (appLogLevel) {
    postData.appLogLevel = appLogLevel;
  }
  if (systemLogLevel) {
    postData.systemLogLevel = systemLogLevel;
  }
  if (debugMode === true || debugMode === false) postData.debugMode = debugMode;
  // call the Admin configuration endpoint
  const response = await restClient.request({
    method: 'post',
    url: `/candyAdmin/v1/deploymentEnvironment/${clusterName}/configure`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json',
    params: {
      preview
    },
    body: JSON.stringify(postData)
  });

  return response;
};

/**
 * Fetches the deployment status for an application
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    id (required) The id of the application.
 * @return  {Object} The endpoint response.
 */
const getApplicationDeployStatus = async options => {
  const {appServerAdmin, appKey, id} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/clientApplications/${id}/status`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Fetches the deployment status for as deployment
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    id (required) The id of the deployment.
 * @return  {Object} The endpoint response.
 */
const getDeploymentDeployStatus = async options => {
  const {appServerAdmin, appKey, id} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/applicationDeployment/${id}/status`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};
/**
 * Fetches the deployment status for a cluster
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    id (required) The id of the cluster.
 * @return  {Object} The endpoint response.
 */
const getClusterDeployStatus = async options => {
  const {appServerAdmin, appKey, id} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/deploymentEnvironment/${id}/status`,
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Fetches the design studio assets for an application
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 *    appName (required) The id of the application.
 *    preview (optional) Default is true. fetches either the preview or live assets.
 * @return  {Object} The endpoint response.
 */

const downloadApplicationAssets = async options => {
  const {appName, appServerAdmin, appKey, preview} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await restClient.request({
    method: 'get',
    url: `/candyAdmin/v1/clientApplications/${appName}/assets`,
    responseType: 'stream',
    params: {live: !preview},
    headers: {
      'X-CCAsset-Language': 'en'
    }
  });

  return response;
};

/**
 * Disables basic auth
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    user (optional) the admin user name. Default 'admin'
 *    password (required) the admin password
 *    code (required) the admin two factor code
 * @return  {Object} The endpoint response.
 */
const disableBasicAuth = async options => {
  const {appServerAdmin, user = 'admin', password, code} = options;
  const restClient = options.restClient || (await createMFARestClient(appServerAdmin, user, password, code));
  const response = await restClient.request({
    method: 'put',
    url: `/candyAdminui/v1/merchant/basicAuth`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json',
    body: JSON.stringify({
      enabled: false
    })
  });

  return response;
};

/**
 * Enables basic auth
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    user (optional) the admin user name. Default 'admin'
 *    password (required) the admin password
 *    code (required) the admin two factor code
 * @return  {Object} The endpoint response.
 */
const enableBasicAuth = async options => {
  const {appServerAdmin, user = 'admin', password, code} = options;
  const restClient = options.restClient || (await createMFARestClient(appServerAdmin, user, password, code));
  const response = await restClient.request({
    method: 'put',
    url: `/candyAdminui/v1/merchant/basicAuth`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json',
    body: JSON.stringify({
      enabled: true
    })
  });

  return response;
};

/**
 * Fetches basic auth settings
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    user (optional) the admin user name. Default 'admin'
 *    password (required) the admin password
 *    code (required) the admin two factor code
 * @return  {Object} The endpoint response.
 */
const getBasicAuth = async options => {
  const {appServerAdmin, user = 'admin', password, code} = options;
  const restClient = options.restClient || (await createMFARestClient(appServerAdmin, user, password, code));
  const response = await restClient.request({
    method: 'get',
    url: `/candyAdminui/v1/merchant/basicAuth`,
    headers: {
      'Content-Type': 'application/json',
      'X-CCAsset-Language': 'en'
    },
    responseType: 'json'
  });

  return response;
};

/**
 * Get all applications.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one,
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The endpoint response.
 */

const getClientApps = async options => {
  const {appServerAdmin, appKey} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
  //logger.info(___`Connecting to ${options.appServerAdmin}`);
  const response = await restClient.request({
    method: 'get',
    url: '/candyAdmin/v1/clientApplications',
    responseType: 'json'
  });

  return response;
};

const getDeploymentsList = async options => {
  const {appName, appServerAdmin, appKey} = options;
  try {
    const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
    const response = await restClient.request({
      method: 'get',
      url: `/candyAdminui/v1/applicationDeployment?appName=${appName}`,
      headers: {
        Accept: 'application/json'
      },
      responseType: 'json'
    });

    return response.body;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      throw error;
    }
  }
};

/**
 * Get the cluster id that has the given app referenced by its applicationId
 */
const getClusterForApp = async options => {
  const {appName, appServerAdmin, appKey} = options;
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));
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

module.exports = {
  getDeploymentEnvironment,
  getDeploymentEnvironments,
  createRestClient,
  createMFARestClient,
  downloadDeploymentById,
  downloadCurrentAppDeployment,
  deployApplication,
  deleteApplication,
  getDeploymentLog,
  getPublishStatus,
  getAppPublishChange,
  getChangeList,
  getChangeListDependencies,
  publish,
  getPublishingChanges,
  redeploy,
  setLoggingConfig,
  getApplicationDeployStatus,
  getClusterDeployStatus,
  getDeploymentDeployStatus,
  downloadApplicationAssets,
  enableBasicAuth,
  disableBasicAuth,
  getBasicAuth,
  getClientApps,
  getDeploymentsList,
  getClusterForApp
};
