const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: usernameOrEmail },
        { username: usernameOrEmail }
      ]
    });

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: "Tài khoản không tồn tại" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: "Mật khẩu không đúng" 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id,
        username: user.username,
        isAdmin: user.isAdmin 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      success: false, 
      message: "Lỗi server", 
      error: err.message 
    });
  }
};
