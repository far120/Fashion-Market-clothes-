const mongoose = require('mongoose');

const userLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
  action: { type: String, required: true }, // مثال: 'CREATE_ORDER', 'DELETE_PRODUCT'
  method: { type: String }, // GET, POST, PUT, DELETE
  url: { type: String }, // URL اللي المستخدم طلبه
  statusCode: { type: Number }, // حالة الاستجابة
  ip: { type: String },
  userAgent: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('UserLog', userLogSchema);
