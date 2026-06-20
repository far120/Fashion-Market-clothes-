const Category = require('../models/category');
const logger = require('../utils/Logger');
const asynchandler = require('express-async-handler');
const APIFeatures = require('../utils/APIFeatures');

/**
 * @desc    add a new category
 * @route   POST /api/categories
 * @method  POST
 * @access  Private (admin only)
 */
exports.addCategory = asynchandler(async (req, res) => {
    const name = req.body.name;
    if (!name) {
        logger.error("Category name is required");
        res.status(400);
        throw new Error("Category name is required");
    }
    await Category.create({ name });
    logger.info(`Category ${name} created successfully`);
    res.status(201).json({ message: "Category created successfully" });
});


/**
 * @desc    get all categories
 * @route   GET /api/categories
 * @method  GET
 * @access  Private (admin only)
 */
exports.getCategories = asynchandler(async (req, res) => {
    logger.info("Fetching categories with pagination");
    const result = await new APIFeatures(Category.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .execute();
    res.status(200).json(result);
});

/**
 * @desc    delete a category
 * @route   DELETE /api/categories/:id
 * @method  DELETE private (admin only)
 */
exports.deleteCategory = asynchandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        logger.error(`Category with id ${req.params.id} not found`);
        return res.status(404).json({ message: "Category not found" });
    }
    await Category.findByIdAndDelete(req.params.id);
    logger.info(`Category with id ${req.params.id} deleted successfully`);
    res.status(200).json({ message: "Category deleted successfully" });
});
