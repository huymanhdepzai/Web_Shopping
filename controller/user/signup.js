const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { username, email, password, fullName, address, phone } = req.body;

  try {
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(400).json({ success: false, message: "Tài khoản hoặc email đã tồn tại" });
    }
    if(!password){
        throw new Error ("Thiếu mật khẩu")
    }
    if(!username){
        throw new Error ("Thiếu tên tài khoản")
    }

    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
      address,
      phone
    });

    await newUser.save();

    // Generate JWT token for new user
    const token = jwt.sign(
      { 
        userId: newUser._id,
        username: newUser.username,
        isAdmin: newUser.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ 
      success: true, 
      message: "Đăng ký thành công", 
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        fullName: newUser.fullName,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};
