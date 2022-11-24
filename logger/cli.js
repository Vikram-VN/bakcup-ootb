const {createLogger, format, transports} = require('winston');
const {getFileLoggingOptions, enumerateErrorFormat, consoleFormatter, LOG_LEVELS} = require('./common');

// consoleLevel = process.env.CLI_LOG_LEVEL || process.env.LOG_LEVEL || 'debug'
let consoleLevel;
if (process.env.CLI_LOG_LEVEL && LOG_LEVELS.includes(process.env.CLI_LOG_LEVEL)) {
  consoleLevel = process.env.CLI_LOG_LEVEL;
} else {
  consoleLevel = LOG_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'http';
}

const transportList = [
  new transports.Console({
    level: consoleLevel,
    handleExceptions: true,
    format: consoleFormatter(process.env.NODE_ENV === 'production' ? `cli-${process.pid}` : 'cli')
  })
];
// If the user also wanted the logs written to disk (i.e. in the Controller)
if (process.env.LOG_DIRECTORY) {
  const options = {
    log: process.env.LOG_DIRECTORY || process.cwd(),
    fileLevel: consoleLevel,
    type: 'cli'
  };
  transportList.push(new transports.File(getFileLoggingOptions(options)));
}

// Creates a logger singleton specifically for cli tools running locally
// Does not save those log messages into a file
const logger = createLogger({
  format: format.combine(enumerateErrorFormat(), format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'})),
  transports: transportList
});

logger.type = 'cli';

module.exports = logger;
