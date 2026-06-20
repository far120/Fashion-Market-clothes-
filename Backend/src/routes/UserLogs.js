const express = require('express');
const router = express.Router();
const UserLog = require('../models/UserLogs');
const authenticate = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const { model } = require('mongoose');
const { GetUserLogs, getUserLogsByEmail } = require('../controllers/userlogsContoller');


/**
 * @desc    get all userslogs
 * @route   GET /api/userslogs
 * @method  GET
 * @access  private (manager)
 */
router.get("/",  authorize(['manager']), GetUserLogs);




module.exports = router;