const Review = require("../models/Review");
const Product = require("../models/product");
const asynchandler = require("express-async-handler");

/**
 * @desc    add a new review
 * @route   POST /api/reviews
 * @method  POST
 * @access  Private
 */
exports.createReview = asynchandler(async (req, res) => {
    const userId = req.user._id;
    const { productId, rating, comment } = req.body;

    // ======================
    // validation
    // ======================
    if (!productId || !rating) {
        return res.status(400).json({
            message: "productId and rating are required"
        });
    }

    const product = await Product.findById(productId);

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    // ======================
    // prevent duplicate review
    // ======================
    const existing = await Review.findOne({
        user: userId,
        product: productId
    });

    if (existing) {
        return res.status(400).json({
            message: "You already reviewed this product"
        });
    }

    // ======================
    // create review
    // ======================
    const review = await Review.create({
        user: userId,
        product: productId,
        rating,
        comment
    });

    // ======================
    // update product rating
    // ======================
    const reviews = await Review.find({ product: productId });

    product.rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await product.save();

    res.status(201).json({
        message: "Review created successfully",
        review
    });
});


/**
 * @desc    get all reviews
 * @route   GET /api/reviews
 * @method  GET
 * @access  Public
 */
exports.getReviews = asynchandler(async (req, res) => {
    const { productId } = req.query;

    let filter = {};

    if (productId) {
        filter.product = productId;
    }

    const reviews = await Review.find(filter)
        .populate("user", "name email")
        .populate("product", "name price");

    res.json({
        count: reviews.length,
        reviews
    });
});


/**
 * @desc    update review by id
 * @route   PUT /api/reviews/:id
 * @method  PUT
 * @access  Private (only review owner)
 */
exports.updateReview = asynchandler(async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    // ======================
    // ownership check
    // ======================
    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const { rating, comment } = req.body;

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // ======================
    // update product rating
    // ======================
    const reviews = await Review.find({ product: review.product });

    const product = await Product.findById(review.product);

    product.rating =
        reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    await product.save();

    res.json({
        message: "Review updated successfully",
        review
    });
});


/**
 * @desc    delete review by id
 * @route   DELETE /api/reviews/:id
 * @method  DELETE
 * @access  Private (only review owner)
 */
exports.deleteReview = asynchandler(async (req, res) => {
    const reviewId = req.params.id;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    // ======================
    // ownership check
    // ======================
    if (review.user.toString() !== userId.toString()) {
        return res.status(403).json({
            message: "Not allowed"
        });
    }

    const productId = review.product;

    await review.deleteOne();

    // ======================
    // update product rating
    // ======================
    const reviews = await Review.find({ product: productId });

    const product = await Product.findById(productId);

    if (reviews.length === 0) {
        product.rating = 0;
    } else {
        product.rating =
            reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    }

    await product.save();

    res.json({
        message: "Review deleted successfully"
    });
});