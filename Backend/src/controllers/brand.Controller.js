const Brand = require('../models/Brand');
const logger = require('../utils/Logger');
const asynchandler = require('express-async-handler');
const APIFeatures = require('../utils/APIFeatures');

/**
 * @desc    add a new brand
 * @route   POST /api/brands
 * @method  POST
 * @access  Private (admin only)
 */
exports.addbrand = asynchandler(async (req, res) => {
    const name = req.body.name;
    if (!name) {
        logger.error("Brand name is required");
        res.status(400);
        throw new Error("Brand name is required");
    }
    await Brand.create({ name });
    logger.info(`Brand ${name} created successfully`);
    res.status(201).json({ message: "Brand created successfully" });
});


/**
 * @desc    get all brands
 * @route   GET /api/brands
 * @method  GET
 * @access  Private (admin only)
 */
exports.getBrands = asynchandler(async (req, res) => {
    logger.info("Fetching brands with pagination");
    const result = await new APIFeatures(Brand.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .execute();
    res.status(200).json(result);
});

/**
 * @desc    delete a brand
 * @route   DELETE /api/brands/:id
 * @method  DELETE
 * @access  Private (admin only)
 */
exports.deleteBrand = asynchandler(async (req, res) => {
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
        logger.error(`Brand with id ${req.params.id} not found`);
        return res.status(404).json({ message: "Brand not found" });
    }
    await Brand.findByIdAndDelete(req.params.id);
    logger.info(`Brand with id ${req.params.id} deleted successfully`);
    res.status(200).json({ message: "Brand deleted successfully" });
});
