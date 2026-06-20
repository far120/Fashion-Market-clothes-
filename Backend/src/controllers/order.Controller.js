const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/User');
const logger = require('../utils/Logger');
const asynchandler = require('express-async-handler');
const authandicate = require('../middlewares/authenticate.middleware');
const authorize = require('../middlewares/authorize.middleware');
const APIFeatures = require('../utils/APIFeatures');

// const orderPopulateOptions = [
//   {
//     path: 'user',
//     select: 'username email image role'
//   },
//   {
//     path: 'items.product',
//     select: 'name price image available category'
//   }
// ];

// async function populateOrder(order) {
//   return order.populate(orderPopulateOptions);
// }

/**
 * @desc   create a new order
 * @route   POST /api/orders
 * @method  POST
 * @access  public
 */
exports.createOrder = asynchandler(async (req, res) => {
  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      message: "Items must be a non-empty array"
    });
  }

  const userId = req.user._id; // 🔥 مهم

  let totalAmount = 0;
  const orderItems = [];

  for (const item of items) {
    const { product: productId, quantity } = item;

    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({
        message: "Invalid product or quantity"
      });
    }

    // 🔥 جيب المنتج من DB
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    if (!product.available) {
      return res.status(400).json({
        message: "Product not available"
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        message: `Not enough stock for ${product.name}`
      });
    }

    // 🔥 السعر من DB مش من request
    const price = product.price;

    totalAmount += price * quantity;

    orderItems.push({
      product: product._id,
      quantity,
      price
    });

    // 🔻 تقليل المخزون
    product.stock -= quantity;
    await product.save();
  }

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalAmount
  });

  // const populatedOrder = await populateOrder(order);

  res.status(201).json({ message: "Order created successfully",});
});

/**
 * @desc   get all orders (for admin) or get my orders (for user)
 * @route   GET /api/orders
 * @method  GET
 * @access  Private
 */
// exports.getOrders = asynchandler(async (req, res) => {
  

//     const result = await new APIFeatures(Order.find(), req.query)
//         .filter()
//         .sort()
//         .limitFields()
//         .paginate()
//         .populate('user')
//         .populate('items.product')
//         .execute();
//     res.status(200).json(result);
// });

exports.getOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = {};

    // =========================
    // 🔐 ROLE BASED ACCESS
    // =========================
    if (req.user.role !== "admin") {
      query.user = req.user._id;
    }

    // optional filter
    if (status && status !== "all") {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate("user")
      .populate("items.product")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalResults = await Order.countDocuments(query);

    res.json({
      status: "success",
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(totalResults / limit),
      totalResults,
      result: orders,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};



/**
 * @desc   manage order status (admin) or cancel order (user)
 * @route   PUT /api/orders/:id
 * @method  PUT
 * @access  Private
 */
exports.updateOrder = asynchandler(async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const order = await Order.findById(orderId);

    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }

    // =========================
    // 👤 USER: cancel only own order
    // =========================
    if (!isAdmin) {
        if (order.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Not allowed" });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "You can only cancel pending orders"
            });
        }

        order.status = "cancelled";
        await order.save();

        // const populatedOrder = await populateOrder(order);

        return res.json({ message: "Order cancelled successfully"});
    }

    // =========================
    // 🧑‍💼 ADMIN: update status
    // =========================
    const allowedStatus = ["pending", "processing", "delivered", "cancelled"];

    const { status } = req.body;

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Invalid status"
        });
    }

    order.status = status;
    await order.save();

    // const populatedOrder = await populateOrder(order);

    res.json({
        message: "Order status updated successfully"
    });
});

