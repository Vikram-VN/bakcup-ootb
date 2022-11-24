/* eslint-disable no-bitwise */
const path = require('path');
const fse = require('fs-extra');
const os = require('os');
const winston = require('winston');

const {combine, timestamp, label, json, splat, printf, colorize} = winston.format;
const morgan = require('morgan');

// Default log levels in winston
const LOG_LEVELS = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly'];

// Adds the error stack messages into the log due to a winston bug
// SEE: https://github.com/winstonjs/winston/issues/1338
const enumerateErrorFormat = winston.format(info => {
  if (info.message instanceof Error) {
    info.message = {
      ...info.message,
      message: info.message.message,
      stack: info.message.stack
    };
  }

  if (info instanceof Error) {
    return {
      ...info,
      message: info.message,
      stack: info.stack
    };
  }

  return info;
});

/**
 * Changes the behavior of console.log/info/etc to call the winston logger
 *
 * @param {Object} logger winston logger to override console.log
 */
function overrideConsoleLog(logger) {
  console.log = (...args) => logger.info.call(logger, ...args);
  console.info = (...args) => logger.info.call(logger, ...args);
  console.warn = (...args) => logger.warn.call(logger, ...args);
  console.error = (...args) => logger.error.call(logger, ...args);
  console.debug = (...args) => logger.debug.call(logger, ...args);
}

/**
 * Changes the logger's logLevel to the specified one
 *
 * @param {Object} logger winston logger whose logLevel is to be changed
 * @param {Object} logLevel the logLevel to change to
 */
function changeLogLevel(logger, logLevel) {
  if (LOG_LEVELS.includes(logLevel)) {
    logger.transports[0].level = logLevel;

    switch (logger.type) {
      case 'storeui':
        logger.transports[1].level = logLevel;
        process.env.STOREUI_LOG_LEVEL = logLevel;
        process.env.STOREUI_LOGFILE_LEVEL = logLevel;
        break;
      case 'controller':
        logger.transports[1].level = logLevel;
        process.env.FILE_LOG_LEVEL = logLevel;
        process.env.FILE_LOGFILE_LEVEL = logLevel;
        break;
      default:
        process.env.CLI_LOG_LEVEL = logLevel;
    }
  }
}

/**
 * Removes any circular object attributes in an object to be stringified
 * See: https://github.com/moll/json-stringify-safe/blob/master/stringify.js
 *
 * @returns {Function} a searializer function that swaps circular attribute with [Circular]
 */
function serializer() {
  const stack = [];

  return function (key, value) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      if (~stack.indexOf(value)) value = '[Circular]';
    } else stack.push(value);

    return value;
  };
}

/**
 * This function returns the winston format for console logging
 *
 * @param {string} type storeui|controller|cli the process initiating the logging
 * @returns {Format} a winston format with a colored message of the form:
 *          [type] level: message stack
 */
function consoleFormatter(type) {
  return combine(
    colorize(),
    splat(),
    printf(({level, message, stack}) => {
      if (typeof message === 'object') {
        message = JSON.stringify(message, serializer(), 2);
      }
      if (typeof stack === 'object') {
        stack = JSON.stringify(stack, serializer(), 2);
      }

      return `[${type}] ${level}: ${message} ${stack ? stack : ''}`;
    })
  );
}

/**
 * Returns a string, the container ID (or null, if the process is not running in a container).
 */
function getContainerId() {
  let containerId = '';
  const procFile = path.resolve('/proc/self/cgroup');
  if (fse.existsSync(procFile)) {
    const data = fse.readFileSync(procFile, 'utf8');
    const lines = data.trim().split('\n');
    [containerId] = lines.slice(-1);
    const regexDocker = /\/docker\/(.{0,12})/g;
    const regexPod = /\/pod.*\/(.{0,12})/g;
    if (typeof containerId === 'string') {
      const matched = containerId.match(regexDocker) || containerId.match(regexPod);
      containerId = matched && matched.length > 0 ? matched[0].replace(/\/.*\//, '') : null;
    } else {
      containerId = null;
    }
  }

  return containerId;
}

// Extract the docker container id from proc file
const CONTAINER_ID = getContainerId() || '';

const hostname = os.hostname() || '';
let containerFolder = CONTAINER_ID;
if (hostname !== CONTAINER_ID) {
  containerFolder = path.join(hostname, CONTAINER_ID);
}

/**
 * The folder where assets mounted on the host machine should be stored.
 * Example: forever and log folders
 * @type String
 */
const VOLUME_MOUNT_PATH = path.join(process.env.PROJECT_ROOT || process.cwd(), 'volume-mount', containerFolder);

/**
 * Returns the logging options used by the server logger to log to disk.
 * The returned object can be passed to new winston.transports.File(<obj>)
 *
 * @param {Object} options An object containing options for the file log output, specifically:
 *    type:       a string to indicate what type of log this is. Usually 'storeui', 'cli', or 'controller'
 *    fileLevel:  a string indicating the level (error, warn, info, verbose, debug, silly)
 *    log:        an absolute path to the directory/file to which logs should be written
 *                  if specifying a folder instead of a file, 'info.log' will be appended to the path
 * @returns {Object} an object of options to be passed to Winston's file logger
 */
function getFileLoggingOptions(options) {
  if (!path.extname(options.log)) {
    // This makes it so those who specify an exact file name (the CLI) can write to that,
    // while others (storeui servers) write to info.log)
    options.log = path.join(options.log, 'info.log');
  }

  // the log format for writing to files in JSON-like messages, to be parsed/returned by the controller
  const fileFormat = combine(
    label({
      label: `${process.env.CLUSTER_ID ? `${process.env.CLUSTER_ID}-` : ''}${CONTAINER_ID ? `${CONTAINER_ID}-` : ''}${
        options.type
      }-${process.pid}`
    }),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    splat(),
    json()
  );

  return {
    level: options.fileLevel,
    filename: options.log,
    eol: '\n',
    handleExceptions: true,
    format: fileFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 8
  };
}

/**
 * Creates a logger to be used by the controller or storeui processes
 *
 * @param {Object} options a set of options for the logger, including:
 *        log: a path to the logging directory,
 *        type: the type of process doing the logging (storeui|controller)
 * @returns {Logger} a winston logger
 */
function createLogger(options) {
  const consoleFormat = consoleFormatter(
    process.env.NODE_ENV === 'production' ? `${options.type}-${process.pid}` : options.type
  );

  const loggingOption = {
    file: getFileLoggingOptions(options),
    console: {
      name: 'consoleStyle',
      level: options.consoleLevel,
      handleExceptions: true,
      format: consoleFormat,
      filename: options.consoleFile
    }
  };

  // Create winston, log to file and console
  const logger = winston.createLogger({
    format: enumerateErrorFormat(),
    transports: [
      new winston.transports.File(loggingOption.file),
      !options.consoleFile
        ? new winston.transports.Console(loggingOption.console)
        : new winston.transports.File(loggingOption.console)
    ],
    exitOnError: false // do not exit on handled exceptions
  });

  logger.type = options.type;

  // redirect morgan log events
  logger.stream = {
    write(message) {
      // Do not log chunking http requests. They tend to bloat the log files.
      // Strip off color codes and new line from morgan messages.
      if (message.includes('/esm/')) {
        // eslint-disable-next-line no-control-regex
        logger.verbose(message.slice(0, -1).replace(/\u001b\[[0-9]{1,2}m/g, ''));
      } else {
        // eslint-disable-next-line no-control-regex
        logger.http(message.slice(0, -1).replace(/\u001b\[[0-9]{1,2}m/g, ''));
      }
    }
  };

  // middleware to listen to express events
  logger.middleware = style => {
    return morgan(style || 'combined', {stream: logger.stream});
  };

  process.on('unhandledRejection', error => {
    logger.error(`Unhandled Rejection: ${error.stack}`);
    logger.warn(
      'Unhandled Promise Rejections are deprecated. In the future, this will crash the application, so add a catch block to handle this promise rejection.'
    );
  });

  return logger;
}

module.exports = {
  getFileLoggingOptions,
  enumerateErrorFormat,
  consoleFormatter,
  overrideConsoleLog,
  changeLogLevel,
  createLogger,
  CONTAINER_ID,
  VOLUME_MOUNT_PATH,
  LOG_LEVELS
};
