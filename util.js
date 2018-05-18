require('dotenv').config();
const { MongoClient } = require('mongodb');
const { winstonConf } = require('./config');
const express = require('express');
const app = express();
const winston = require('winston');
const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = {
  app,
  MongoClient,
  logger,
};
