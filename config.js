const mongoUriParser = require('mongodb-uri');
const winston = require('winston');
const env = {
  isDev: process.env.NODE_ENV == 'development',
  isTest: process.env.NODE_ENV == 'test',
  isProd: process.env.NODE_ENV == 'production',
};

if (!process.env.NODE_ENV) throw new Error('NODE_ENV is not specified');

const mongoUri = !env.isProd
  ? `mongodb://127.0.0.1:27017/testingMongoCrud`
  : process.env.MONGO_URI;

const tokenSecret = !env.isProd ? 'A3.Fw;+T~.$@fo' : process.env.TOKEN_SECRET;

module.exports = {
  mongoConf: {
    uri: mongoUri,
    dbName: mongoUriParser.parse(mongoUri).database,
  },
  expressConf: {
    port: process.env.PORT || 3000,
  },
  tokenSecret,
  env,
};
