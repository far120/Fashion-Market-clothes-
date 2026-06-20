const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User');
const Review = require('../models/Review');
const {createReview , getReviews , updateReview , deleteReview} = require("../controllers/Review.Controller");
const asynchandler = require('express-async-handler');
const authorize = require('../middlewares/authorize.middleware');
const authandicate = require('../middlewares/authenticate.middleware');
const upload = require('../middlewares/uploadMiddleware');
const {createReviewSchema , updateReviewSchema} = require('../validators/ReviewValidator');
const validate = require('../middlewares/validate');

/**
 * @desc    add a new review
 * @route   POST /api/reviews
 * @method  POST
 * @access  Public
 */
router.post('/' ,authandicate , createReview )


/** * @desc    get all reviews
 * @route   GET /api/reviews
 * @method  GET
 * @access  Public
 */
router.get('/'  , getReviews )

/** * @desc    putch review by id
 * @route   PUT /api/reviews/:id
 * @method  PUT
 * @access  Private (only review owner)
 */
router.put('/:id' , authandicate , validate(updateReviewSchema) , updateReview )

/** * @desc    delete review by id
 * @route   DELETE /api/reviews/:id
 * @method  DELETE
 * @access  Private (only review owner)
 */
router.delete('/:id' , authandicate ,  deleteReview )






module.exports = router;