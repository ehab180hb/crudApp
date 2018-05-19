const { MongoClient } = require('mongodb');
const { mongoConf } = require('../../config');

module.exports = async function() {
  try {
    const { uri, dbName } = mongoConf;
    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    const db = client.db(dbName);
    this.db = db;
    return {
      async refreshCollection(collectionName, collectionContent) {
        return new Promise(async (resolve, reject) => {
          try {
            const collection = db.collection(collectionName);
            await collection.remove();
            await collection.insertMany(collectionContent);
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
      async cleanUp() {
        return new Promise(async (resolve, reject) => {
          try {
            await db.dropDatabase();
            await client.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      },
    };
  } catch (error) {
    reject(error);
  }
};
