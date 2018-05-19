const express = require('express');
const router = express.Router();

const {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
} = require('../controllers/user');

router
  .route('/')
  .get(getAllUsers)
  .post(addUser);

router
  .route('/:id/')
  .get(getUser)
  .put(editUser)
  .delete(deleteUser);

module.exports = router;
