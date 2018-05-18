const express = require('express');
const router = express.Router();
const { getHealthCheck } = require('../controllers/healthCheck');

router.route('/').get(getHealthCheck);

module.exports = router;
