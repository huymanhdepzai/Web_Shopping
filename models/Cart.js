const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Product',
    required: true
  },  
  productName: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Số lượng sản phẩm phải lớn hơn 0']
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Giá sản phẩm không được âm']
  },
  total: {
    type: Number,
    required: true,
    min: [0, 'Tổng tiền không được âm']
  }
});

const cartSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Tổng tiền không được âm']
  },
  createdAt: Date,
  updatedAt: Date,
}, {
  timestamps: true
});

// Middleware để tự động tính toán total cho mỗi item
cartItemSchema.pre('save', function(next) {
  this.total = this.price * this.quantity;
  next();
});

// Middleware để tự động tính toán totalAmount cho cart
cartSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
