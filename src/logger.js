const fs = require('fs');

const Logger = {};

Logger.logInfo = (message) => {
  const infoMessage = `${new Date().toISOString()} : ${message}\n`;
  const infoStream = fs.createWriteStream('logs/info.txt', { flags: 'a' });
  console.info(message);
  return infoStream.write(infoMessage);
};

Logger.logDebug = (message) => {
  const debugMessage = `${new Date().toISOString()} : ${message}\n`;
  const debugStream = fs.createWriteStream('logs/debug.txt', { flags: 'a' });
  console.debug(message);
  return debugStream.write(debugMessage);
};

Logger.logError = (error) => {
  const errorMessage = `${new Date().toISOString()}\nMessage: ${error.message}\nCode: ${error.code}\nStack: ${
    error.stack
  }\n`;
  const errorStream = fs.createWriteStream('logs/error.txt', { flags: 'a' });
  return errorStream.write(errorMessage);
};

module.exports = Logger;
