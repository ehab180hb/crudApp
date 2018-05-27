require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { winstonConf, env } = require('./config');
const express = require('express');
const app = express();
const winston = require('winston');

const logger = winston.createLogger({
  silent: env.isTest || false,
  format: env.isProd ? winston.format.json() : winston.format.simple(),
  transports: [new winston.transports.Console()],
});

module.exports = {
  app,
  MongoClient,
  ObjectId,
  logger,
};
