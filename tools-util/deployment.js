const path = require('path');
const fs = require('fs-extra');
const {___} = require('@sugar-candy-framework/tools-i18n').i18n({directory: path.join(__dirname, './locales')});
const yauzl = require('yauzl');
const {getDeploymentEnvironment} = require('./endpoints');
const {createRestClient} = require('./rest-client');

/*
 * Returns the workspace folder where deployment files are saved.
 * The location is specific to the application directory and
 * the destination admin server.
 */
const getDeploymentFileLocation = (appServerAdmin, appName) => {
  const url = new URL(appServerAdmin);

  return path.resolve('packages', 'apps', appName, '.occ', 'deployments', url.hostname);
};

/* Returns the folder path where we store asset download zip files */
const getAssetDownloadZipFileLocation = (appServerAdmin, appName) => {
  const url = new URL(appServerAdmin);

  return path.resolve('packages', 'apps', appName, '.occ', 'asset-downloads', url.hostname);
};

const getAssetDownloadZipFileName = (appName, preview) => {
  const context = preview ? 'preview' : 'live';

  // Q: Should the time/date be encoded here? Would mean we'd have to remove old files manually rather than overwriting
  return `${appName}_${context}_assets.zip`;
};
/*
 * Given a server, app name and context, forms the location of the file used to store
 * the downloaded zip of assets.
 * By default the zip file is saved in the workspace's .occ folder using
 * an app server, app name and context specific naming. For example,
 * /.occ/asset-downloads/acme.test.com/commerce-store_preview_assets.zip
 */
const getAssetDownloadZipFilePath = (appServerAdmin, appName, preview) => {
  return path.resolve(
    getAssetDownloadZipFileLocation(appServerAdmin, appName),
    getAssetDownloadZipFileName(appName, preview)
  );
};
/*
 * Returns the workspace folder where downloaded deployments are saved.
 */
const getDeploymentDownloadFileLocation = (appServerAdmin, appName) => {
  const url = new URL(appServerAdmin);

  return path.resolve('packages', 'apps', appName, '.occ', 'deployment-downloads', url.hostname);
};

/*
 * Returns the name of the file where the
 * server response from a deployment is saved.
 */
const getDeploymentResponseFileName = appName => {
  return `${appName}-deploy-response.json`;
};

/*
 * Returns meta-data about the last deployment on this workspace for the given
 * server and app.
 */
const getLastDeploymentResponseFromWorkspace = (appServerAdmin, appName, localDevAppName) => {
  console.debug(
    `Running getLastDeploymentResponseFromWorkspace with ${appServerAdmin}, ${appName}, ${localDevAppName}`
  );
  const deployResponse = {};
  const filename = path.resolve(
    getDeploymentFileLocation(appServerAdmin, appName),
    getDeploymentResponseFileName(localDevAppName || appName)
  );
  deployResponse.responseFileLocation = filename;

  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename);
    if (data) {
      const parsedData = JSON.parse(data);
      deployResponse.responseData = parsedData;
      if (parsedData) {
        deployResponse.appServerAdmin = parsedData.appServerAdmin;
        deployResponse.date = parsedData.date;
        if (parsedData.response && parsedData.response.body) {
          deployResponse.deploymentId = parsedData.response.body.deploymentId;
        }
      }
    }
  }

  return deployResponse;
};

//Returns the deploymentId for the last successful deployment
//of the app to the given server.
const getLastDeploymentIdFromWorkspace = (appServerAdmin, appName, localDevAppName) => {
  console.debug(`Running getLastDeploymentIdFromWorkspace with ${appServerAdmin}, ${appName}, ${localDevAppName}`);
  const responseData = getLastDeploymentResponseFromWorkspace(appServerAdmin, appName, localDevAppName);

  if (responseData && responseData.deploymentId) {
    return responseData.deploymentId;
  }
};

//Returns the path to the deployment zip file for the given app and server.
const getDeploymentZipPath = (appServerAdmin, appName, localDevAppName) => {
  console.debug(`Running getDeploymentZipPath with ${appServerAdmin}, ${appName}, ${localDevAppName}`);

  const deployFileLocation = getDeploymentFileLocation(appServerAdmin, appName);

  return path.resolve(deployFileLocation, `${localDevAppName || appName}.zip`);
};

//Returns the deployment zip file for the given app and server
const getDeploymentZipFromWorkspace = (appServerAdmin, appName, localDevAppName) => {
  console.debug(`Running getDeploymentZipFromWorkspace with ${appServerAdmin}, ${appName}, ${localDevAppName}`);

  const filename = getDeploymentZipPath(appServerAdmin, appName, localDevAppName);
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename);

    return data;
  }
};

//Returns the downloaded deployment (zip) for the given server, app and deployment id
const getDeploymentDownloadZipFromWorkspace = (appServerAdmin, appName, deploymentId) => {
  console.debug(`Running getDeploymentDownloadZipFromWorkspace with ${appServerAdmin}, ${appName}, ${deploymentId}`);
  const filename = path.resolve(
    getDeploymentDownloadFileLocation(appServerAdmin, appName),
    `${appName}_${deploymentId}.zip`
  );

  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename);

    return data;
  }
};

/**
 * Fetches the configured set of preview and live controllers
 * from admin.
 *
 * If a rest client is not provided one will be created for making the endpoint
 * call
 *
 * @param {Object} options An object containing values needed. Currently this
 *    endpoint accepts:
 *    restClient (optional) This client will be used instead of creating a new one.
 *    clusterId (optional) The id of the deployment environment for which to get the controllers.
 *    appServerAdmin (optional) admin server url for creating the rest client
 *    appKey (optional) application key for logging into the admin server.
 * @return  {Object} The endpoint response.
 */
const fetchControllers = async options => {
  const {appServerAdmin, appKey, clusterId = 'storefront'} = options;
  console.debug(`Running fetchControllers with ${clusterId} ${appServerAdmin} ${appKey}`);
  const restClient = options.restClient || (await createRestClient(appServerAdmin, appKey));

  const response = await getDeploymentEnvironment({restClient, appServerAdmin, appKey, clusterId});

  const controllers = {
    liveControllers: response.liveControllers,
    previewControllers: response.previewControllers
  };
  console.debug(`fetchControllers returning ${JSON.stringify(controllers)}`);

  return controllers;
};

function getFileFromDeployment(fileName, deploymentZipFile) {
  return new Promise((resolve, reject) => {
    let fileContents = '';
    // The workspace files exists in a 'workspace' folder in the template zip.
    // Flatten that out as we create the workspace in the destination.
    yauzl.open(deploymentZipFile, {lazyEntries: true}, function (err, zipfile) {
      if (err) {
        console.log(err);
        reject(err);
      }
      zipfile.readEntry();
      zipfile
        .on('entry', function (entry) {
          if (/\/$/.test(entry.fileName) || entry.fileName !== fileName) {
            zipfile.readEntry();
          } else {
            // Ignore directory files, will be created through files.
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) {
                console.log(err);
                reject(err);
              }
              readStream.on('data', function (chunk) {
                fileContents += chunk.toString();
              });
              readStream.on('end', function () {
                zipfile.close();
              });
            });
          }
        })
        .on('close', function () {
          if (fileContents === '') {
            reject(new Error(___`File ${fileName} not found in deployment zip.`));

            return;
          }
          resolve(fileContents);
        });
    });
  });
}

/**
 * Extracts file contents from a zip file (assuming all files are under the `workspace` folder)
 * and returns their contents in a {filename: filecontents} map.
 * Repeatedly calls getFileFromDeployment.
 * @param {Array<string>} filenames a list of files to extract from the zip file
 * @param {string} deploymentZipFile a path to an accelerator/deployment zip from which files should be gotten
 * @returns {object} A map from the name of the file to its contents in the zip file
 *    e.g. {'.yarnrc': 'offline-cache-enabled: true'}
 * @throws if any of the filenames is not found in the deployment zip.
 */
async function getFilesFromDeployment(filenames, deploymentZipFile) {
  // Get each desired file from the disk, store the contents in an array
  const fileContents = await Promise.all(
    filenames.map(file => getFileFromDeployment(`workspace/${file}`, deploymentZipFile))
  );
  // Zip up the filenames/fileContents arrays into an object {filename: contents}
  const files = {};
  for (let i = 0; i < filenames.length; i++) {
    files[filenames[i]] = fileContents[i];
  }

  return files;
}

module.exports = {
  getLastDeploymentIdFromWorkspace,
  getDeploymentZipFromWorkspace,
  getDeploymentDownloadZipFromWorkspace,
  fetchControllers,
  getFileFromDeployment,
  getFilesFromDeployment,
  getDeploymentZipPath,
  getDeploymentFileLocation,
  getDeploymentResponseFileName,
  getAssetDownloadZipFilePath,
  getAssetDownloadZipFileName,
  getDeploymentDownloadFileLocation,
  getLastDeploymentResponseFromWorkspace
};
