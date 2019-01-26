const { version } = require('../../package.json');
const runningEnv = process.env.NODE_ENV;
module.exports = {
  getHealthCheck(_req, res) {
    res.status(200).json({ ok: 1, version, runningEnv });
  },
};
