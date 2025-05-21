const User = require("../../models/User");
const bcrypt = require("bcrypt");

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

    res.json({ success: true, message: "Đăng ký thành công", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
  }
};
