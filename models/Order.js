const mongoose = require("mongoose");  
const Schema = mongoose.Schema;  
  
const orderItemSchema = new Schema({  
  product: {  
    type: Schema.Types.ObjectId,  
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
  
const orderSchema = new Schema(  
  {  
    user: {  
      type: Schema.Types.ObjectId,  
      ref: 'User',
      required: true  
    },  
    sessionId: {
      type: String,
      required: true
    },  
    items: [orderItemSchema],  
    totalAmount: {  
      type: Number,  
      required: true,
      min: [0, 'Tổng tiền không được âm']
    },  
    shippingAddress: {  
      fullName: {
        type: String,
        required: [true, 'Họ tên người nhận là bắt buộc']
      },  
      address: {
        type: String,
        required: [true, 'Địa chỉ là bắt buộc']
      },  
      city: {
        type: String,
        required: [true, 'Thành phố là bắt buộc']
      },  
      phone: {
        type: String,
        required: [true, 'Số điện thoại là bắt buộc'],
        match: [/^[0-9]{10}$/, 'Số điện thoại không hợp lệ']
      }  
    },  
    paymentMethod: {
      type: String,
      required: [true, 'Phương thức thanh toán là bắt buộc'],
      enum: ['Tiền mặt', 'Chuyển khoản', 'Thẻ tín dụng']
    },  
    paymentStatus: {  
      type: String,  
      enum: ['Đang chờ xử lý', 'Hoàn Thành', 'Thất bại'],  
      default: 'Đang chờ xử lý'  
    },  
    orderStatus: {  
      type: String,  
      enum: ['Đang xử lý', 'Đã giao hàng', 'Đã nhận hàng', 'Đã hủy'],  
      default: 'Đang xử lý'  
    },
    note: {
      type: String,
      trim: true
    }
  },  
  {  
    timestamps: true  
  }  
);  

// Middleware để tự động tính toán total cho mỗi item
orderItemSchema.pre('save', function(next) {
  this.total = this.price * this.quantity;
  next();
});

// Middleware để tự động tính toán totalAmount cho order
orderSchema.pre('save', function(next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.total, 0);
  next();
});

module.exports = mongoose.model("Order", orderSchema);