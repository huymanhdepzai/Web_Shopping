const mongoose = require("mongoose");  
const Schema = mongoose.Schema;  
  
const userSchema = new Schema(  
  {  
    username: {  
      type: String,  
      required: [true, "Tên tài khoản là bắt buộc"],  
      unique: true  
    },  
    email: {  
      type: String,  
      required: [true, "Email là bắt buộc"],  
      unique: true  
    },  
    password: {  
      type: String,  
      required: [true, "Mật khẩu là bắt buộc"]  
    },  
    fullName: String,  
    address: String,  
    phone: String,  
    isAdmin: {  
      type: Boolean,  
      default: false  
    }  
  },  
  {  
    timestamps: true  
  }  
);  
  
module.exports = mongoose.model("User", userSchema);