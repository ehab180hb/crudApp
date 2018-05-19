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
  /**
   * @api {get} /api/v1/user/ Get all users
   * @apiVersion 1.0.0
   * @apiName GetAll
   * @apiGroup User
   * @apiSuccess {String} id The user ID
   * @apiSuccess {String} email The user email
   * @apiSuccessExample {json} Success response
   *  HTTPS 200 OK
   *  [{
   *    "id": "5affe783a49ebd0355359913",
   *    "email": "user1@email.com"
   *  },
   *  {
   *    "id": "5affe783a49ebd0355359923",
   *    "email": "user1@email.com"
   *  }]
   */
  .get(getAllUsers)
  /**
   * @api {post} /api/v1/user/ Create a new user
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup User
   * @apiSuccess {number} n The user ID
   * @apiSuccess {String} email The user email
   * @apiSuccessExample {json} Success response
   *  HTTPS 200 OK
   *  {
   *    "id": "5affe783a49ebd0355359923",
   *    "email": "user1@email.com"
   *  }
   */
  .post(addUser);

router
  .route('/:id/')
  /**
   * @api {get} /api/v1/user/:id Get a user
   * @apiVersion 1.0.0
   * @apiName GetOne
   * @apiGroup User
   * @apiSuccess {String} id The user ID
   * @apiSuccess {String} email The user email
   * @apiSuccessExample {json} Success response
   *  HTTPS 200 OK
   *  {
   *    "id": "5affe783a49ebd0355359923",
   *    "email": "user1@email.com"
   *  }
   */
  .get(getUser)
  .put(editUser)
  .delete(deleteUser);

module.exports = router;
