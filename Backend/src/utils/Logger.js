const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
    // format.errors({ stack: true }),
    // format.printf(({ level, message, timestamp, stack }) => {
    //   return `[${timestamp}] ${level.toUpperCase()}: ${stack || message}`;
    // })
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'src/logs/error.log', level: 'error' }),
    new transports.File({ filename: 'src/logs/combined.log' }), 
  ],
});

module.exports = logger;