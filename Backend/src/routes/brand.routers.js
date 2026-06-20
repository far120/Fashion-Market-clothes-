const express = require('express');
const router = express.Router();
const Brand = require('../models/category');
const {addbrand , getBrands ,deleteBrand} = require("../controllers/brand.Controller");
const asynchandler = require('express-async-handler');
const authorize = require('../middlewares/authorize.middleware');
const authandicate = require('../middlewares/authenticate.middleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @desc    add a new brand
 * @route   POST /api/brands
 * @method  POST
 * @access  Private (admin only)
 */

router.post('/' , authorize(['admin']), addbrand )

/**
 * @desc    get all brands
 * @route   GET /api/brands
 * @method  GET
 * @access  Public
 */
router.get('/' , getBrands) 

/**
 * @desc    delete a brand
 * @route   DELETE /api/brands/:id
 * @method  DELETE
 * @access  Private (admin only)
 */
router.delete('/:id' , authorize(['admin']), deleteBrand)
 





module.exports = router;