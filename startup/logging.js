require('winston-mongodb');
require('express-async-errors');
const winston = require('winston');


module.exports = () => {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  )
  process.on('unhandledRejection', (e) => {
    throw e;
  })
  winston.add(new winston.transports.File({ filename: 'logfile.log' }))
  winston.add(new winston.transports.Console({ colorize: true, }))
}