const mongoose = require('mongoose');
const config = require('config');
const winston = require('winston');


module.exports = () => {
  const db = config.get('db');
  mongoose.connect(db.uri, db.options)
    .then(() => winston.info(`Connected to ${db.uri}...`));
}

