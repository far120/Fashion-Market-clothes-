const multer = require('multer');
const path = require('path');
const fs = require('fs');

// مسار حقيقي ثابت
const uploadPath = path.join(__dirname, '../uploads');

// إنشاء الفولدر لو مش موجود
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('Only images allowed'), false);
  }
};

// middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 2 }
});

module.exports = upload;