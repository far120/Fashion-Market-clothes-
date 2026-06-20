const Proudct = require('../models/product');
const Category = require('../models/category');
const logger = require('../utils/Logger');
const asynchandler = require('express-async-handler');
const ApiFeatures = require('../utils/APIFeatures');



/**
 * @desc   add a new product
 * @route   POST /api/products
 * @method  POST
 * @access  Private (admin only)
 */
exports.createProduct = asynchandler(async (req,res)=>{
    const payload = {
        ...req.body,
    };

    if (req.file) {
        payload.image = `/uploads/${req.file.filename}`;
    }

    const savedProduct = await Proudct.create(payload);
    logger.info("Product created successfully");
    res.status(201).json(savedProduct);
})

/**
 * @desc   get all products
 * @route   GET /api/products
 * @method  GET
 * @access  Public
 */
exports.getAllProducts = asynchandler(async (req,res)=>{
    // res.status(200).json(res.paginatedResult);
    const result = await new ApiFeatures(Proudct.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate()
        .populate('category')
        .populate("brand")
        .execute();
    res.status(200).json(result);
})

/**
 * @desc   get product by id
 * @route   GET /api/products/:id
 * @method  GET
 * @access  Public
 */
exports.getProductById = asynchandler(async (req,res)=>{
    const productid = req.params.id;
    const product = await Proudct.findById(productid).populate('category').populate("brand");
    if(!product){
        res.status(404).json({message:"Product not found"});
    }
    res.status(200).json(product);
})

/**
 * @desc   update product by id
 * @route   PUT /api/products/:id
 * @method  PUT
 * @access  Private (admin only)
 */
exports.updateProduct = asynchandler(async (req,res)=>{
    const productid = req.params.id;
    const payload = {
        ...req.body,
    };

    if (req.file) {
        payload.image = `/uploads/${req.file.filename}`;
    }

    const product = await Proudct.findByIdAndUpdate(productid, payload, { returnDocument: "after"  });
    if(!product){
        res.status(404).json({message:"Product not found"});
    }
    res.status(200).json(product);
})

/**
 * @desc   delete product by id
 * @route   DELETE /api/products/:id
 * @method  DELETE
 * @access  Private (admin only)
 */
exports.deleteProduct = asynchandler(async (req,res)=>{
    const productid = req.params.id;
    const product = await Proudct.findByIdAndDelete(productid);
    if(!product){
        res.status(404).json({message:"Product not found"});
    }
    res.status(200).json({message:"Product deleted successfully"});
})

