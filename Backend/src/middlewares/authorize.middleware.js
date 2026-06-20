const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authanticate = require('./authenticate.middleware');

function authorize(roles = []) {
    if (typeof roles === 'string') {
        roles = [roles];
    }
    return [
        authanticate,
        async (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        }
    ];
}

module.exports = authorize;