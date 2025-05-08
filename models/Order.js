const mongoose = require("mongoose");  
const Schema = mongoose.Schema;  
  
const orderItemSchema = new Schema({  
  product: {  
    type: Schema.Types.ObjectId,  
    ref: 'Product',  
    required: true  
  },  
  productName: String,  
  quantity: {  
    type: Number,  
    required: true,  
    min: 1  
  },  
  price: Number,  
  total: Number  
});  
  
const orderSchema = new Schema(  
  {  
    user: {  
      type: Schema.Types.ObjectId,  
      ref: 'User'  
    },  
    sessionId: String,  
    items: [orderItemSchema],  
    totalAmount: {  
      type: Number,  
      required: true  
    },  
    shippingAddress: {  
      fullName: String,  
      address: String,  
      city: String,  
      phone: String  
    },  
    paymentMethod: String,  
    paymentStatus: {  
      type: String,  
      enum: ['Đang chờ xử lý', 'Hoàn Thành', 'Thât bại'],  
      default: 'Đang chờ xử lý'  
    },  
    orderStatus: {  
      type: String,  
      enum: ['Đang xử lý', 'Đã giao hàng', 'Đã nhận hàng', 'Đã hủy'],  
      default: 'Đang xử lý'  
    }  
  },  
  {  
    timestamps: true  
  }  
);  
  
module.exports = mongoose.model("Order", orderSchema);