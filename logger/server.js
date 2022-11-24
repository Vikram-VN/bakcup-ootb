const {createLogger, LOG_LEVELS} = require('./common');

// consoleLevel = process.env.STOREUI_LOG_LEVEL || process.env.LOG_LEVEL || 'debug'
let consoleLevel;
if (process.env.STOREUI_LOG_LEVEL && LOG_LEVELS.includes(process.env.STOREUI_LOG_LEVEL)) {
  consoleLevel = process.env.STOREUI_LOG_LEVEL;
} else {
  consoleLevel = LOG_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'http';
}

// fileLevel = process.env.STOREUI_LOGFILE_LEVEL || process.env.LOG_LEVEL || 'http'
let fileLevel;
if (process.env.STOREUI_LOGFILE_LEVEL && LOG_LEVELS.includes(process.env.STOREUI_LOGFILE_LEVEL)) {
  fileLevel = process.env.STOREUI_LOGFILE_LEVEL;
} else {
  fileLevel = LOG_LEVELS.includes(process.env.LOG_LEVEL) ? process.env.LOG_LEVEL : 'http';
}

// Creates a logger singleton for server-side log messages
module.exports = createLogger({
  log: process.env.LOG_DIRECTORY || process.cwd(),
  consoleLevel,
  fileLevel,
  type: 'storeui'
});
