const express = require('express');
const router = express.Router();
const { modifyUserSchema, idInObjectSchema } = require('../models/user.model');
const { validate } = require('../handlers/validation');

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
   * @apiSuccessExample {json} Success response:
   *  HTTPS 200 OK
   *  [{
   *    "id": "5affe783a49ebd0355359913",
   *    "email": "user1@email.com"
   *  },
   *  {
   *    "id": "5affe783a49ebd0355359923",
   *    "email": "user1@email.com"
   *  }]
   * @apiError {Object} response The response object
   * @apiError {String} response.error The error message
   * @apiErrorExample {json} Error response:
   *  HTTPS 404 NOT FOUND
   *  { "error": "There are no existing users" }
   */
  .get(getAllUsers)
  /**
   * @api {post} /api/v1/user/ Create a new user
   * @apiVersion 1.0.0
   * @apiName Create
   * @apiGroup User
   * @apiParam {String} email User's email
   * @apiSuccess {Boolean} created A true boolean indicating success
   * @apiSuccessExample {json} Success response:
   *  HTTPS 201 CREATED
   *  { "created": true }
   * @apiError {Object} response The response object
   * @apiError {String} response.error The error message
   * @apiErrorExample {json} Error response:
   *  HTTPS 409 CONFLICT
   *  { "error": "User already exists" }
   * @apiErrorExample {json} Error response:
   *  HTTPS 400 BAD REQUEST
   *  {
   *    "error": "Invalid email format"
   *  }
   */
  .post(validate('body', modifyUserSchema), addUser);

router
  .route('/:id/')
  /**
   * @api {get} /api/v1/user/:id Get a user
   * @apiVersion 1.0.0
   * @apiName GetOne
   * @apiGroup User
   * @apiSuccess {String} id The user ID
   * @apiSuccess {String} email The user email
   * @apiSuccessExample {json} Success response:
   *  HTTPS 200 OK
   *  {
   *    "id": "5affe783a49ebd0355359923",
   *    "email": "user1@email.com"
   *  }
   * @apiError {Object} response Respone object
   * @apiError {String} response.error The error message.
   * @apiErrorExample {json} Error respone:
   *  HTTPS 400 BAD REQUEST
   *  {
   *    "error": "Invalid email format"
   *  }
   * @apiErrorExample {json} Error respone:
   *  HTTPS 404 NOT FOUND
   *  { "error": "User not found"  }
   */
  .get(validate('params', idInObjectSchema), getUser)
  /**
   * @api {patch} /api/v1/user/:id Update user
   * @apiVersion 1.0.0
   * @apiName Update
   * @apiGroup User
   * @apiParam {String} id User ID
   * @apiParam {String} email User's email
   * @apiSuccess {Boolean} updated A true boolean indicating success
   * @apiSuccessExample {json} Success response:
   *  HTTPS 200 OK
   *  { "updated": true }
   * @apiError {Object} response Respone object
   * @apiError {String} response.error The error message.
   * @apiErrorExample {json} Error respone:
   *  HTTPS 404 NOT FOUND
   *  { "error": "User not found" }
   * @apiErrorExample {json} Error respone:
   *  HTTPS 400 BAD REQUEST
   *  { "error": "Invalid email format" }
   */
  .patch(
    validate('params', idInObjectSchema),
    validate('body', modifyUserSchema),
    editUser,
  )
  /**
   * @api {delete} /api/v1/user/:id Delete user
   * @apiVersion 1.0.0
   * @apiName Delete
   * @apiGroup User
   * @apiParam {String} id User ID
   * @apiSuccess {Boolean} deleted A true boolean indicating success
   * @apiSuccessExample {json} Success respone:
   * HTTPS 200 OK
   * { "deleted": true }
   * @apiError {Object} response Respone object
   * @apiError {String} response.error The error message.
   * @apiErrorExample {json} Error respone:
   *  HTTPS 404 NOT FOUND
   *  { "error": "User not found" }
   * @apiErrorExample {json} Error respone:
   *  HTTPS 400 BAD REQUEST
   *  {
   *    error: "Invalid ID, must be a string of 24 hex characters"
   *  }
   */
  .delete(validate('params', idInObjectSchema), deleteUser);

module.exports = router;
