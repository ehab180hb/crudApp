require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { winstonConf } = require('./config');
const express = require('express');
const app = express();
const winston = require('winston');
const logger = winston.createLogger({
  silent: process.env.NODE_ENV == 'test' || false,
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = {
  app,
  MongoClient,
  ObjectId,
  logger,
};
