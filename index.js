//Boiler Plate

//Dependencies and Setup
require('dotenv').config(); //uses .env to get variables
const express = require('express');
const app = express();
const winston = require('winston');
require('winston-mongodb');


//Modules I've created
require('./startup/logging')(); //uses winston to start logging
require('./startup/db')(); //connects to mongodb
require('./startup/routes')(app); //sets up route handling
require('./startup/config')(); //ensures private key is set
require('./startup/validation')(); //sets up Joi and allows access to ObjectId()



//3001 selected because it will be used as proxy in React app
const port = process.env.PORT || 3001;

//Sets up initial listening
const server = app.listen(port, () => {
  winston.info(`listening on port ${port}...`)
});

module.exports = server;