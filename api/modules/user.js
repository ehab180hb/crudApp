module.exports = db => {
  const collection = db.collection('users');
  const User = collection;
  return User;
};
