const { Session } = require("express-session");
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  product: {  
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'Product'  
  },  
  productName: String,
  quantity: Number,
  price: Number,
  total: Number,
});

const cartSchema = new mongoose.Schema({
  sessionId: String,
  items: [cartItemSchema],
  totalAmount: Number,
  createdAt: Date,
  updatedAt: Date,
}, {
  timestamps: true,
}
);

module.exports = mongoose.model("Cart", cartSchema);
