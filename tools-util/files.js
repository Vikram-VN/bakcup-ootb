const fsp = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const {PopStackError} = require('@sugar-candy-framework/tools-util/errors');

/**
 * Splits the content of a directory into a list of files and a list of directories.
 *
 * The directory content is represented as a list of `fs.Dirent` elements,
 * possibly obtained using the `readdir` method from the Node's File System module.
 *
 * @param      {[fs.Dirent]}  list    The content of a directory.
 * @return     {[[string], [string]]} A list of two elements. First element has the files, and the second has the directories.
 */
function splitFilesAndDirectories(list) {
  return [
    list.filter(item => !item.isDirectory()).map(file => file.name),
    list.filter(item => item.isDirectory()).map(file => file.name)
  ];
}

/**
 * List files on the specified directory.
 *
 * @param      {object}   [options={}]  The listing options.
 * @param      {string}   [options.directory='.']    The directory from which list the files
 * @param      {Boolean}  [options.recursive=false]  List files on sub-directories too, in a depth-first way.
 * @param      {[string]} [options.ignore=[]]        Exclude files and directories which name matches an element on this list.
 * @return     {Promise}  List of files.
 */
async function listFiles(options = {}) {
  const baseDirectory = options.directory || '.';
  const recursive = options.recursive || false;
  const ignore = new Set(options.ignore);
  const result = [];
  const directories = [baseDirectory];

  do {
    const directory = directories.pop();

    let content;
    try {
      content = await fsp.readdir(directory, {withFileTypes: true});
    } catch (reason) {
      if (!result.errors) {
        result.errors = [];
      }
      console.error(`Error: ${reason.message}`);
      result.errors.push(reason);
      continue;
    }

    const filteredContent = content.filter(item => !ignore.has(item.name));
    const [fileNames, subdirectoryNames] = splitFilesAndDirectories(filteredContent);
    // Define relative file and sub-directory names.
    const files = fileNames.map(item => path.join(directory, item));
    const subdirectories = subdirectoryNames.map(item => path.join(directory, item)).reverse();

    if (recursive) {
      result.push(directory);
      directories.push(...subdirectories);
    } else {
      result.push(...subdirectories);
    }
    result.push(...files);
  } while (directories.length);

  return result;
}

/**
 * grep-like tool.
 *
 * Returns the lines that match the specified pattern.
 *
 * Usage examples; get from a file the lines that resemble a credit card number:
 *     creditCardLike = filePatternSearcher(/\d{8,19}/, './logFile.txt')
 *     creditCardLike = filePatternSearcher(String.raw`\d{8,19}`, './logFile.txt')
 *     creditCardLike = filePatternSearcher('\\d{8,19}', './logFile.txt')
 *
 * @param      {RegExp|string}   pattern  The pattern to search for.
 * @param      {string}   file   The path to the file that will be inspected.
 * @return     {[string]}        List of lines that matched the pattern.
 */
async function filePatternSearcher(pattern, file /*, options = {}*/) {
  let expression;
  if (typeof pattern === 'string') {
    expression = new RegExp(pattern);
  } else if (pattern instanceof RegExp) {
    expression = pattern;
  } else {
    throw new PopStackError(`Type of first argument ('${typeof pattern}') is not 'string' or 'RegExp'`);
  }
  if (typeof file !== 'string') {
    throw new PopStackError(`Type of second argument ('${typeof file}') is not 'string'`);
  }
  const filePath = path.resolve(file);

  let content;
  try {
    content = await fsp.readFile(filePath, 'utf8');
  } catch (reason) {
    console.error(reason.message);
    content = '';
  }

  const lines = content.split(/\r?\n|\r/);
  const matches = lines.filter(line => expression.test(line));

  return matches;
}

async function filterFilesContaining(pattern, files) {
  const expression = new RegExp(pattern);

  const searchResult = await Promise.all(
    files.map(async file => {
      const matches = await filePatternSearcher(expression, file);

      return [matches.length, file];
    })
  );

  const filesThatMatched = searchResult.filter(([count]) => count).map(([, file]) => file);

  return filesThatMatched;
}

/**
 * Returns the list of files which should be calculated as part of a checksum object.
 * @param {string} appDir the application directory, for files relative to the application (e.g. server.js)
 * @param {string} workspaceFolder the path to the root of the workspace
 * @returns {Array<string>} a list of *absolute* file paths which should have
 *    their checksums calculated and added to the _TOTAL checksum.
 */
function getListOfFilesToVerify(appDir, workspaceFolder = process.cwd()) {
  return [
    'package.json',
    'yarn.lock',
    path.join(appDir, 'package.json'),
    path.join(appDir, 'dist', 'cjs', 'min', 'server.js'),
    path.join(appDir, 'dist', 'esm', 'min', 'manifest.json')
    // TODO what else here? Should we allow customers to specify their own files to check in their app package.json
  ].map(relativePath => path.resolve(workspaceFolder, relativePath));
}

/**
 * Calculates and returns the sha256 checksum of various files in the given array. All checksums are 8 characters
 * @param {Array<string>} fileList an array of absolute paths to files whose checksums should be calculated
 * @returns {object} an object containing the paths of the hashed files as keys and their hashes as values, as
 *   wells as "_TOTAL": <checksum>, a checksum of all the files combined.
 *   Note that if a checksum is null, the file was not present when the checksum was calculated.
 */
async function getSha256(fileList) {
  // Read in the contents of all the files into an array.
  // TODO memory concerns here? Depends on how large list of files is.
  const fileContents = await Promise.all(
    fileList.map(async filePath => {
      try {
        return fsp.readFile(filePath);
      } catch (e) {
        console.debug(e);

        return undefined;
      }
    })
  );
  // Calculate the hash of each file, as well as all the files together, building a map of filePath => hash to be returned
  const sumHash = crypto.createHash('sha256');
  const toReturn = {};
  for (const i of fileList.keys()) {
    if (!fileContents[i]) {
      console.debug(`${fileList[i]} could not be loaded`);
      toReturn[fileList[i]] = null;

      continue;
    }
    sumHash.update(fileContents[i]);
    toReturn[fileList[i]] = crypto.createHash('sha256').update(fileContents[i]).digest('hex').slice(0, 8);
  }
  toReturn._TOTAL = sumHash.digest('hex').slice(0, 8);

  return toReturn;
}

module.exports = {
  filePatternSearcher,
  filterFilesContaining,
  listFiles,
  getListOfFilesToVerify,
  getSha256
};
