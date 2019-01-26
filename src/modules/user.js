const bcrypt = require('bcryptjs');

function customFunctions(collection) {
  return {
    /**
     * Creates a new user in the db with hashed password.
     * @param {string} email
     * @param {string} password
     * @returns {string} The 24 hex char ID of the user's document in the db.
     */
    async registerNew(email, password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const user = await collection.insertOne({
        email,
        password: hashedPassword,
      });
      return user.insertedId;
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
  const collection = db.collection('users');
  const User = collection;
  User.customFunctions = customFunctions(collection);
  return User;
};
