const { mongoConf } = require('../../config');
const { MongoClient, ObjectId } = require('../../util');

const userModule = require('./user');

module.exports = async () => {
  const { uri, dbName } = mongoConf;
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(dbName);
  process.once('exit', async () => {
    await client.close();
  });
  return {
    ObjectId,
    User: userModule(db),
  };
};
