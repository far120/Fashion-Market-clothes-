const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User');
const {createProduct , getAllProducts , getProductById , updateProduct , deleteProduct} = require("../controllers/product.Controller");
const authorize = require('../middlewares/authorize.middleware');
const authandicate = require('../middlewares/authenticate.middleware');
const upload = require('../middlewares/uploadMiddleware');
const {createProductSchema , updateProductSchema} = require('../validators/ProductValidator');
const validate = require('../middlewares/validate');

/**
 * @desc   add a new product
 * @route   POST /api/products
 * @method  POST
 * @access  Private (admin only)
 */
router.post('/' , authandicate , authorize('admin') , upload.single('image') , validate(createProductSchema) , createProduct)


/**
 * @desc   get all products
 * @route   GET /api/products
 * @method  GET
 * @access  Public
 */
router.get('/' , getAllProducts)

/**
 * @desc   get product by id
 * @route   GET /api/products/:id
 * @method  GET
 * @access  Public
 */
router.get('/:id' , getProductById)

/**
 * @desc   update product by id
 * @route   PUT /api/products/:id
 * @method  PUT
 * @access  Private (admin only)
 */
router.put('/:id' , authandicate , authorize('admin') , upload.single('image') , validate(updateProductSchema) , updateProduct )

/**
 * @desc   delete product by id
 * @route   DELETE /api/products/:id
 * @method  DELETE
 * @access  Private (admin only)
 */
router.delete('/:id' , authandicate , authorize('admin') , deleteProduct )

module.exports = router;