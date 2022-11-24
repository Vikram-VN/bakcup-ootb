const path = require('path');
const fs = require('fs-extra');
const {___} = require('@sugar-candy-framework/tools-i18n').i18n({directory: path.join(__dirname, '../locales')});
const {dashCase} = require('@sugar-candy-framework/tools-util/strings');
const {unzipAcceleratorTemplate} = require('./utils');

const acceleratorLocation = path.resolve(`${__dirname}/../templates`);
const newPackageVersion = '0.1.0';

/**
 * Returns the full path of an accelerator template for the given application name.
 *
 * @param {String} appName The name of the application for which to resolve the template.
 * @returns the full path to the template zip
 */
const resolveAcceleratorTemplate = appName => {
  const templatePath = path.resolve(acceleratorLocation, `${appName}.zip`);
  // If a accelerator template doesn't exist with the name given, prompt for one
  // based on the available templates.
  if (!fs.existsSync(templatePath)) {
    console.log(___`Failed to resolve template named ${appName}`);
    const choices = getTemplateChoices();
    console.log(___`Available template choices are:`);
    for (const choice of choices) {
      console.log(`\t - ${choice}`);
    }
    console.log();

    throw new Error(___`Template name ${appName} not found.`);
  }

  return templatePath;
};

/**
 * Return list of available accelerator templates
 */
function getTemplateChoices() {
  const templateChoices = [];
  const files = fs.readdirSync(path.resolve(acceleratorLocation));

  files.forEach(file => {
    if (file.includes('.zip')) {
      // Parse the template name from the file name
      const choice = file.substring(0, file.indexOf('.zip'));
      templateChoices.push(choice);
    }
  });

  return templateChoices;
}

/**
 * Returns a validated folder name to be used when creating the workspace.
 *
 * @param {String} appPackageName The package name user provided.
 */
const standardizeAppPackageName = appPackageName => {
  // remove the @scope portion of the package name
  let newAppIdentifier = appPackageName.substring(appPackageName.lastIndexOf('/') + 1);
  // remove special characters from start/end of folder name
  // newAppIdentifier = newAppIdentifier.replace(/^[\W|_]*/, '');
  // newAppIdentifier = newAppIdentifier.replace(/[\W|_]*$/, '');
  // // replace all non [a-z0-9] with '-'
  // newAppIdentifier = newAppIdentifier.replace(/\W/g, '-');
  newAppIdentifier = dashCase(newAppIdentifier);
  const nonAcceptableAppPackageNames = ['apps', 'packages', 'workspace'];
  if (newAppIdentifier.length === 0 || nonAcceptableAppPackageNames.includes(newAppIdentifier)) {
    throw new Error(___`${appPackageName} is not a valid package name.`);
  }

  return newAppIdentifier;
};

/**
 * Modify a package.json file when creating a new package from template.
 *
 * @param {String} pathToFile Path to a specific package.json
 * @param {Object} newKeyValue Contains key:value pairs to be written in package.json
 */
const modifyPackageJson = (pathToFile, newKeyValues) => {
  try {
    const data = fs.readFileSync(pathToFile, 'utf-8');
    const jsonData = JSON.parse(data);

    // Modify description based on previous data
    const description = `Based on v${jsonData.version} of ${jsonData.name}`;
    newKeyValues['description'] = description;

    // if app contains aliases in package.json, replace template name with user provided appPackageName
    if (jsonData.occ.aliases) {
      for (const [aliasKey, aliasValue] of Object.entries(jsonData.occ.aliases)) {
        jsonData.occ.aliases[aliasKey] = aliasValue.replace(jsonData.name, newKeyValues.name);
      }
    }
    // modify relevant fields in package.json
    Object.assign(jsonData, newKeyValues);

    fs.writeFileSync(pathToFile, JSON.stringify(jsonData, null, 2));
  } catch (error) {
    throw new Error(___`Failed to read or write package.json : ${pathToFile}`);
  }
};

/**
 * Returns true if an app with the same appName exists in the workspace.
 *
 * @param {String} appName the app name to be generated
 */
function appExists(appName) {
  appName = appName.trim();
  const currentAppsList = fs.readdirSync(path.resolve('packages', 'apps'));
  if (currentAppsList.includes(appName)) {
    return true;
  }

  return false;
}
/**
 * Generate a new workspace by unzipping the given template path to the
 * given workspace destination.
 *
 * @param {String} templatePath The path to the template zip
 * @param {String} workspaceDest The workspace destination folder
 * @param {String} newAppIdentifier The standardized package name provided by the user
 */
async function generateWorkspace(templatePath, workspaceDest, newAppPackageName) {
  fs.mkdirpSync(workspaceDest);

  const newAppPackagePath = newAppPackageName ? standardizeAppPackageName(newAppPackageName) : null;
  await unzipAcceleratorTemplate('workspace', templatePath, workspaceDest, newAppPackagePath);

  if (newAppPackageName) {
    // modify package.json in /packages/apps/{$appName} level
    const pathToPackageJson = path.resolve(workspaceDest, 'packages', 'apps', newAppPackagePath, 'package.json');
    const newKeyValues = {
      name: newAppPackageName,
      version: newPackageVersion
    };
    modifyPackageJson(pathToPackageJson, newKeyValues);
  }
}

/**
 * Generate a new app by unzipping the given template path.
 *
 * @param {String} templatePath The path to the template zip
 * @param {String} appDest The workspace destination folder
 */
async function createAppFromTemplate(templateName, appPackageName) {
  const templatePath = resolveAcceleratorTemplate(templateName);
  const appFolderName = appPackageName ? standardizeAppPackageName(appPackageName) : templateName;
  const newAppPath = path.resolve('packages', 'apps', appFolderName);

  if (appExists(appFolderName)) {
    throw new Error(___`Application with name '${appFolderName}' already exists in the workspace.`);
  }

  fs.mkdirpSync(newAppPath);
  await unzipAcceleratorTemplate('app', templatePath, newAppPath);

  if (appPackageName) {
    // modify package.json in /packages/apps/{$appName} level
    const pathToPackageJson = path.resolve(newAppPath, 'package.json');
    const newKeyValues = {
      name: appPackageName,
      version: newPackageVersion
    };
    modifyPackageJson(pathToPackageJson, newKeyValues);
  }
}

module.exports = {
  acceleratorLocation,
  getTemplateChoices,
  resolveAcceleratorTemplate,
  generateWorkspace,
  createAppFromTemplate,
  modifyPackageJson,
  standardizeAppPackageName,
  newPackageVersion
};
