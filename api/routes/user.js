const express = require('express');
const router = express.Router();
const {
  validateBody,
  validateParamId,
} = require('../handlers/user/validation');

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
   *    "error": "ValidationError: child \"email\" fails because [\"email\" must be a valid email]"
   *  }
   */
  .post(validateBody('addUser'), addUser);

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
   *    "error": "ValidationError: child "email" fails because ["email" must be a valid email]"
   *  }
   * @apiErrorExample {json} Error respone:
   *  HTTPS 404 NOT FOUND
   *  { "error": "User not found"  }
   */
  .get(validateParamId, getUser)
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
   *  { "error": "ValidationError: child \"email\" fails because [\"email\" must be a valid email]" }
   */
  .patch(validateParamId, validateBody('editUser'), editUser)
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
   *    error: "ValidationError: child \"id\" fails because [\"id\" with value \"hij\" fails to match the required pattern: /^[0-9a-fA-F]{24}$/]"
   *  }
   */
  .delete(validateParamId, deleteUser);

module.exports = router;
