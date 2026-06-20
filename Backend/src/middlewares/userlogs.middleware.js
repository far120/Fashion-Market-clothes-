const UserLog = require('../models/UserLogs');

module.exports = (options = {}) => {
  return (req, res, next) => {
    const start = Date.now();

    res.on('finish', async () => {
      try {
        if (!req.user) return;

        await UserLog.create({
          user: req.user._id,
          username: req.user.username,   // عدل حسب schema عندك
          email: req.user.email,
          action: req.action || `${req.method} ${req.originalUrl}`,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          ip: req.ip,
          userAgent: req.headers['user-agent']
        });

      } catch (err) {
        console.error('Logging error:', err.message);
      }
    });

    next();
  };
};