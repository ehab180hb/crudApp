require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const { winstonConf, env } = require('./config');
const express = require('express');
const app = express();
const {
  LoggingWinston: StackdriverLogging,
} = require('@google-cloud/logging-winston');
const winston = require('winston');
const logger = winston.createLogger({
  silent: env.isTesting || false,
  format: env.isProd ? winston.format.json() : winston.format.simple(),
  transports: [new winston.transports.Console()],
});

if (env.isProd) logger.add(new StackdriverLogging());

module.exports = {
  app,
  MongoClient,
  ObjectId,
  logger,
};
