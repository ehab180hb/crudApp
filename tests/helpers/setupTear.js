const { MongoClient } = require('mongodb');
const { mongoConf } = require('../../src/config');

module.exports = async function() {
  const { uri, dbName } = mongoConf;
  const client = await MongoClient.connect(uri, { useNewUrlParser: true });
  const db = client.db(dbName);
  return {
    async refreshCollection(collectionName, collectionContent) {
      const collection = db.collection(collectionName);
      await collection.remove();
      await collection.insertMany(collectionContent);
    },
    async cleanUp(level) {
      await db.dropDatabase();
      if (level == 'light') {
        return;
      }
      await client.close();
    },
  };
};
