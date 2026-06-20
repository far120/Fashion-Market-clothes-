const joi = require('joi');
const objectId = joi.string().hex().length(24);

const createProductSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    description: joi.string().max(255).optional(),
    price: joi.number().positive().required(),
    category: objectId.required(),
    brand: objectId.optional(),
    stock: joi.number().integer().min(0).optional(),
    available: joi.boolean().optional(),
    image: joi.string().uri().optional()
});

const updateProductSchema = joi.object({
    name: joi.string().min(2).max(100).optional(),
    description: joi.string().max(255).optional(),
    price: joi.number().positive().optional(),
    category: objectId.required(),
    brand: objectId.optional(),
    stock: joi.number().integer().min(0).optional(),
    available: joi.boolean().optional(),
    image: joi.string().uri().optional()
});

module.exports = {
    createProductSchema,
    updateProductSchema
};