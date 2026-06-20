/**
 * ميدل وير تحديد معدل الطلبات (Rate Limiting)
 * يمنع المستخدم من إرسال عدد كبير من الطلبات في وقت قصير
 */

// ميدل وير تحديد معدل الطلبات
const rateLimit = require('express-rate-limit');
module.exports = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000,
  message: 'Too many requests, please try again later.'
});
