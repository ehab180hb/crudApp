const { MongoClient } = require('mongodb');
const { mongoConf } = require('../../config');

module.exports = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { uri, dbName } = mongoConf;
      const client = await MongoClient.connect(uri, { useNewUrlParser: true });
      const db = client.db(dbName);
    } catch (error) {
      throw new Error(error);
    }
    resolve(
      {
        refreshCollection: async function refreshCollection(
          collectionName,
          collectionContent,
        ) {
          try {
            const collection = db.collection(collectionName);
            await collection.drop();
            await collection.insertMany(collectionContent);
          } catch (error) {
            reject(new Error(error));
          }
        },
      },
      {
        cleanUp: async function cleanUp() {
          return new Promise(async (resolve, reject) => {
            try {
              await db.drop();
              await client.close();
            } catch (error) {
              reject(new Error(error));
            }
          });
        },
      },
    );
  });
};
