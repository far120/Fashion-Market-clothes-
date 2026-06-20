// validators/userValidator.js
const Joi = require('joi');

// Schema لإنشاء مستخدم جديد
const ValidateCreateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
   role: Joi.string().valid('admin', 'user' , 'manager').optional(),
  image: Joi.string().optional(),
});

const ValidateUpdateMeSchema = Joi.object({
  username: Joi.string().min(3).max(30).optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).optional(),
  role: Joi.string().valid('admin', 'user' , 'manager').optional(),
  image: Joi.string().optional(),
});

const ValidateUserlogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

const ValidateResetPassword = Joi.object({
  currentPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required()
});

module.exports = {
  ValidateCreateUserSchema,
  ValidateUpdateMeSchema,
  ValidateUserlogin,
  ValidateResetPassword
};
