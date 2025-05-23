const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: [true, 'Mã sản phẩm là bắt buộc'],
      unique: true
    },
    productName: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true
    },
    description: {
      general: {
        type: String,
        required: true
      },
      specifications: {
        screen: String,
        operatingSystem: String,
        rearCamera: String,
        frontCamera: String,
        cpu: String,
        ram: String,
        storage: String,
        externalStorage: String,
        battery: String,
      },
      features: [String],
      warranty: String
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá sản phẩm không được âm']
    },
    salePrice:{
      type: String,
      required:[true, 'Giá sản phẩm là bắt buộc'],
    },
    category: {
      type: String,
      required: [true, 'Danh mục sản phẩm là bắt buộc']
    },
    brandName: {
      type: String,
      required: [true, 'Tên thương hiệu là bắt buộc']
    },
    img: [{
      type: String,
      required: [true, 'Hình ảnh sản phẩm là bắt buộc']
    }],
    stock: {
      type: Number,
      required: [true, 'Số lượng tồn kho là bắt buộc'],
      min: [0, 'Số lượng tồn kho không được âm'],
      default: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: Date,
    updatedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Tạo index cho tìm kiếm
productSchema.index({ productName: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
