const { mongoConf } = require('../../config');
const { MongoClient } = require('../../util');

const userModule = require('./user');

module.exports = async () => {
  const { uri, dbName } = mongoConf;
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(dbName);
  return {
    User: userModule(db),
  };
};