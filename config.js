const mongoUriParser = require('mongodb-uri');
const winston = require('winston');
const isDev = process.env.NODE_ENV == 'development' || false;
const isTesting = process.env.NODE_ENV == 'test' || false;

const mongoUri =
  isDev || isTesting
    ? `mongodb://127.0.0.1:27017/testingMongoCrud`
    : process.env.MONGO_URI;

const tokenSecret =
  isDev || isTesting ? 'A3.Fw;+T~.$@fo' : process.env.TOKEN_SECRET;

module.exports = {
  mongoConf: {
    uri: mongoUri,
    dbName: mongoUriParser.parse(mongoUri).database,
  },
  expressConf: {
    port: process.env.PORT || 3000,
  },
  tokenSecret,
};
