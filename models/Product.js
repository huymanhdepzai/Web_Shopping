const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: String,
    description: String,
    price: String,
    category: String,
    brandName: String,
    img: [],
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  },
);
productSchema.index({ productName: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
