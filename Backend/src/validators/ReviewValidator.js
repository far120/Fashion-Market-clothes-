const joi = require('joi');
const objectId = joi.string().hex().length(24);

const createReviewSchema = joi.object({
    user: objectId.required(),
    product: objectId.required(),
    rating: joi.number().min(1).max(5).required(),
    comment: joi.string().max(255).optional()
});

const updateReviewSchema = joi.object({
    rating: joi.number().min(1).max(5).optional(),
    comment: joi.string().max(255).optional()
});