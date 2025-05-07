const mongoose = require("mongoose");

const productSchema = new Schema(
  {
    productName: String,
    description: String,
    price: Number,
    sellingPrice: Number,
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

module.export = mongoose.model("Product", productSchema);
