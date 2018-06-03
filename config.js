const mongoUriParser = require('mongodb-uri');
const env = {
  isDev: process.env.NODE_ENV == 'development',
  isTest: process.env.NODE_ENV == 'test',
  isProd: process.env.NODE_ENV == 'production',
};

if (env.isProd) requiredEnvs(['TOKEN_SECRET', 'MONGO_URI']);

const mongoUri = !env.isProd
  ? `mongodb://127.0.0.1:27017/testingMongoCrud`
  : process.env.MONGO_URI;

const tokenSecret = !env.isProd ? 'A3.Fw;+T~.$@fo' : process.env.TOKEN_SECRET;

function requiredEnvs(envsArr) {
  envsArr.forEach(env => {
    if (!process.env[env]) {
      console.log(env);
      throw `missing enviroment variable ${env}`;
    }
  });
}

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
