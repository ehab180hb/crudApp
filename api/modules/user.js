const bcrypt = require('bcryptjs');

function customFunctions(collection) {
  return {
    /**
     * Creates a new user in the db with hashed password.
     * @param {string} email
     * @param {string} password
     * @returns {string} The 24 hex char ID of the user's document in the db.
     */
    registerNew(email, password) {
      return new Promise(async (resolve, reject) => {
        try {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          const user = await collection.insertOne({
            email,
            password: hashedPassword,
          });
          resolve(user.insertedId);
        } catch (error) {
          reject(error);
        }
      });
    },
    /**
     * Check if the given email exists in the database.
     * @param {string} email
     * @return {Object} The user object.
     */
    getUser(email) {
      return collection.findOne({ email });
    },
  };
}

module.exports = db => {
  try {
    const collection = db.collection('users');
    const User = collection;
    User.customFunctions = customFunctions(collection);
    return User;
  } catch (error) {
    throw new Error(error);
  }
};
