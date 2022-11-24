const cliLogger = require('./cli');
const serverLogger = require('./server');
const {overrideConsoleLog, changeLogLevel, CONTAINER_ID, VOLUME_MOUNT_PATH} = require('./common');

module.exports = {
  overrideConsoleLog,
  changeLogLevel,
  CONTAINER_ID,
  VOLUME_MOUNT_PATH,
  serverLogger,
  cliLogger
};
