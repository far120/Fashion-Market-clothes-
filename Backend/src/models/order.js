// src/models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        },

        quantity: {
          type: Number,
          required: true,
          min: 1
        },

        // 🔥 مهم علشان السعر ميتغيرش بعد الأوردر
        price: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ],

    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["pending", "processing", "delivered", "cancelled"],
      default: "pending"
    }
  },
  { timestamps: true }
);

orderSchema.statics.getStats = async function () {
  const stats = await this.aggregate([
    {
      $facet: {
        // 1️⃣ Total revenue (delivered فقط)
        revenue: [
          { $match: { status: "delivered" } },
          {
            $group: {
              _id: null,
              total: { $sum: "$totalAmount" }
            }
          }
        ],

        // 2️⃣ total price لكل status
        byStatus: [
          {
            $group: {
              _id: "$status",
              totalPrice: { $sum: "$totalAmount" },
              count: { $sum: 1 }
            }
          }
        ],

        // 3️⃣ total price لكل الأوردرات (كلهم مع بعض)
        total: [
          {
            $group: {
              _id: null,
              totalPrice: { $sum: "$totalAmount" },
              count: { $sum: 1 }
            }
          }
        ]
      }
    }
  ]);

  const res = stats?.[0] || {};

  return {
    totalRevenue: res.revenue?.[0]?.total || 0,

    totalAllOrdersPrice: res.total?.[0]?.totalPrice || 0,
    totalOrdersCount: res.total?.[0]?.count || 0,

    byStatus: res.byStatus || []
  };
};



module.exports = mongoose.model("Order", orderSchema);