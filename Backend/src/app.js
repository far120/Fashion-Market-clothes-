const express = require('express');
const connectDB = require('./config/db');
const AppError = require('./utils/app-error.utils');
const morgan = require('morgan');
const logger = require('./utils/Logger');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

// Load environment variables from .env file
require("dotenv").config();


// create express app
const app = express();


// connect to database
connectDB();



// middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// for logging http requests
app.use(morgan('dev'));
// security middlewares
app.use(helmet());
// enable CORS for all routes
app.use(cors("*"));
// compress responses
app.use(compression());
// rate limiting
app.use(require("./middlewares/rateLimit"));
// user logs middleware (after auth middleware to have access to req.user)
app.use(require("./middlewares/userlogs.middleware")());



// routes
app.use("/api/users", require('./routes/User'));
app.use("/api/userslogs", require('./routes/UserLogs'));
app.use("/api/products", require('./routes/product.routes'));
app.use("/api/orders", require('./routes/order.routes'));
app.use("/api/reviews", require('./routes/Review.routers'));
app.use("/api/categories", require('./routes/category.routers'));
app.use("/api/brands", require('./routes/brand.routers'));




// logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Global Error Handler
app.use((req,res,next)=>{
    // next(new Error(`Can't find ${req.originalUrl} on this server`, 404));
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404))
})

// catch all errors and pass them to the error handler
app.use(require('./middlewares/error-handler.middleware'));


// listen to server
const port = process.env.PORT || 3002;
app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
});