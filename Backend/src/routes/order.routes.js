const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User');
const {createOrder , getOrders, updateOrder} = require("../controllers/order.Controller");
const asynchandler = require('express-async-handler');
const authorize = require('../middlewares/authorize.middleware');
const authandicate = require('../middlewares/authenticate.middleware');
const upload = require('../middlewares/uploadMiddleware');

/**
 * @desc   create a new order
 * @route   POST /api/orders
 * @method  POST
 * @access  public
 */
router.post('/' , authandicate , createOrder  )

/**
 * @desc   get all orders for admin 
 * @route   GET /api/orders
 * @method  GET
 * @access  Private
 */
router.get('/' ,authandicate  , getOrders  )


/**
 * @desc   manage order status (for admin) or cancel my order (for user)
 * @route   PUT /api/orders/:id
 * @method  PUT
 * @access  Private
 */
router.put('/:id' , authandicate , updateOrder )



router.get("/stats", async (req, res) => {
  try {
    const stats = await Order.getStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;