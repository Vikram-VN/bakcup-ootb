const fse = require('fs-extra');
const path = require('path');
const {createLogger, LOG_LEVELS, VOLUME_MOUNT_PATH} = require('./common');

// consoleLevel = process.env.SYSTEM_LOG_LEVEL || process.env.LOG_LEVEL || 'debug'
let consoleLevel;
if (process.env.SYSTEM_LOG_LEVEL && LOG_LEVELS.includes(process.env.SYSTEM_LOG_LEVEL)) {
  consoleLevel = process.env.SYSTEM_LOG_LEVEL;
} else {
  consoleLevel = LOG_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'debug';
}

// fileLevel = process.env.SYSTEM_LOGFILE_LEVEL || process.env.LOG_LEVEL || 'http'
let fileLevel;
if (process.env.SYSTEM_LOGFILE_LEVEL && LOG_LEVELS.includes(process.env.SYSTEM_LOGFILE_LEVEL)) {
  fileLevel = process.env.SYSTEM_LOGFILE_LEVEL;
} else {
  fileLevel = LOG_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'http';
}

const LOGS_PATH = path.join(VOLUME_MOUNT_PATH, 'log');
const CONTROLLER_LOG_FOLDER = path.join(LOGS_PATH, 'controller');
if (!fse.existsSync(CONTROLLER_LOG_FOLDER)) {
  fse.mkdirsSync(CONTROLLER_LOG_FOLDER);
}

const logger = createLogger({
  log: CONTROLLER_LOG_FOLDER,
  consoleLevel,
  fileLevel,
  type: 'controller'
});

// Add JSON POST request logging for debugging purposes
logger.requestLogger = (req, res, next) => {
  logger.debug(`Headers: ${JSON.stringify(req.headers)}`);
  if (req.method === 'POST') {
    if (req.headers['content-type'] !== 'application/octet-stream') {
      logger.debug(`Body: ${JSON.stringify(req.body)}`);
    } else {
      logger.debug(`Octet Stream Length: ${req.body.length}`);
    }
  }
  next();
};

logger.LOGS_PATH = LOGS_PATH;

module.exports = logger;
