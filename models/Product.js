const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: String,
    description: String,
    price: Number,
    price: Number,
    category: String,
    brandName: String,
    productImage: [],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
