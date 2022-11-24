const fs = require('fs-extra');
const yauzl = require('yauzl');
const path = require('path');
const {___} = require('@sugar-candy-framework/tools-i18n').i18n({directory: path.join(__dirname, '../locales')});

/**
 * Replaces the app identifier of a template with a user provided package name
 *
 * @param {String} filePath The path to a file
 * @param {String} newAppIdentifier The standardized package name provided by the user
 * @returns {String} newFilePath the new path with an updated app identifier
 */
function replaceAppPackageName(filepath, newAppIdentifier) {
  // trimming off 'packages/apps'
  filepath = filepath.replace('packages/apps/', '');
  // remove app identifier from the file path
  const pathAfterAppIdentifier = filepath.substring(filepath.indexOf('/') + 1);
  // replace app identifier with user provided package name
  const newFilePath = `packages/apps/${newAppIdentifier}/${pathAfterAppIdentifier}`;

  if (!filepath || typeof filepath !== 'string' || !filepath.trim() || !pathAfterAppIdentifier.trim()) {
    throw new Error(___`Failed to replace package name in file path.`);
  }

  return newFilePath;
}

const skipConditions = [
  // Ignore directory files, will be created through files.
  file => /\/$/.test(file),
  // filters out deployment.json and ignore all files not in workspace directory
  file => !file.startsWith('workspace')
];

/**
 * Unzip an accelerator template to a dest.
 * Replace package name if needed.
 *
 * @param {String} Type                 workspace | app
 * @param {String} pathToTemplate       The path to the template zip
 * @param {String} dest                 The workspace destination folder
 * @param {String} newAppIdentifier     The standardized package name provided by the user
 * @returns {Promise} that unzips template into new workspace.
 */
async function unzipAcceleratorTemplate(type, pathToTemplate, dest, newAppIdentifier) {
  let changePath = file => file;
  if (type === 'app') {
    // Add skip to ignore everything but the apps directory
    skipConditions.push(file => !file.startsWith('workspace/packages/apps'));
    // Flatten down to the apps directory (assuming 'workspace' was already flattened)
    changePath = file => {
      file = file.replace('packages/apps/', '');

      return file.substring(file.indexOf('/') + 1);
    };
  } else if (newAppIdentifier) {
    // Replace the file path with the new app name if relevant
    changePath = file => (file.startsWith('packages/apps') ? replaceAppPackageName(file, newAppIdentifier) : file);
  }

  return new Promise((resolve, reject) => {
    // The workspace files exists in a 'workspace' folder in the template zip.
    // Flatten that out as we create the workspace in the destination.
    yauzl.open(pathToTemplate, {lazyEntries: true}, function (err, zipfile) {
      if (err) {
        console.log(err);
        reject(err);
      }
      zipfile.readEntry();
      zipfile
        .on('entry', function (entry) {
          if (skipConditions.reduce((bool, fn) => bool || fn(entry.fileName), false)) {
            zipfile.readEntry();
          } else {
            zipfile.openReadStream(entry, function (err, readStream) {
              if (err) {
                console.log(err);
                reject(err);
              }
              readStream.on('end', function () {
                zipfile.readEntry();
              });

              const {fileName} = entry;
              // Flatten new location by trimming off 'workspace'
              let filepath = fileName.replace('workspace/', '');
              // Transform file path when applicable
              filepath = changePath(filepath);

              const dirName = path.resolve(dest, path.dirname(filepath));
              // Create the directory where the file is going
              fs.mkdirpSync(dirName);
              // Write it out...
              readStream.pipe(fs.createWriteStream(path.resolve(dest, filepath)));
            });
          }
        })
        .on('close', function () {
          console.log(___`Successfully created ${type} in ${dest}`);
          console.log();
          resolve();
        });
    });
  });
}

module.exports = {
  unzipAcceleratorTemplate
};
