// src/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 1
    },

    description: {
      type: String,
      default: ""
    },

    image: {
      type: String,
      default: "default.png"
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Brand",
        required: true
    },
    available: {
      type: Boolean,
      default: true
    },

    stock: {
      type: Number,
      default: 1,
      min: 0
    }
  },
  { timestamps: true }
);

productSchema.pre("save", function () {
  this.available = this.stock > 0;
});

productSchema.pre("findOneAndUpdate", function () {
  const update = this.getUpdate() || {};

  const nextStock =
    update.stock !== undefined
      ? update.stock
      : update.$set?.stock;

  if (nextStock !== undefined) {
    const available = Number(nextStock) > 0;

    if (update.$set) {
      update.$set.available = available;
    } else {
      update.available = available;
    }

    this.setUpdate(update);
  }
});

module.exports = mongoose.model("Product", productSchema);