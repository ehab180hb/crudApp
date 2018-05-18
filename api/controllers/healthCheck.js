module.exports = {
  getHealthCheck: function getHealthCheck(req, res) {
    res.status(200).json({ ok: 1 });
  },
};
