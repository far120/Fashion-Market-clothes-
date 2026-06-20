// middlewares/validate.js
/**
 * Middleware عام للتحقق من صحة البيانات باستخدام Joi
 * استخدمه في أي route مع أي schema
 * مثال: router.post('/users', validate(createUserSchema), controller.createUser)
 */
module.exports = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      // أرسل رسالة خطأ موحدة
      // return next(new Error(error.details[0].message, 400));
      return next(new (require('../utils/app-error.utils'))(error.details[0].message, 400));

    }
    next();
  };
};
