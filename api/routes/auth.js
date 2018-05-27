const express = require('express');
const router = express.Router();
const { signUp, signIn, secret } = require('../controllers/auth');
const { protectRoute } = require('../modules/auth');
const validate = require('../handlers/auth/validation');

router
  .route('/signup')
  /**
   * @api {post} /api/v1/auth/signup Register a new user
   * @apiVersion 1.0.0
   * @apiName Signup
   * @apiGroup Auth
   * @apiParam {String} email User's email
   * @apiSuccess {String} token The JWT token
   * @apiSuccessExample {json} Success response:
   *  HTTPS 201 CREATED
   *  { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzb21lYXBwIiwic3ViIjoiNWIwN2RjYjdjMjY2YzQ3ZDQyMzkxOGNkIiwiaWF0IjoxNTI3MjQxOTEyMDQ5fQ.zjjhDvajp3rdW3Yb5OjaP-ufla-SmWcplhKbY9eEZsM" }
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
  .post(validate('auth'), signUp);
router.route('/signin').post(signIn);
router.route('/secret').get(protectRoute, secret);

module.exports = router;
