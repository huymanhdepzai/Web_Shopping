module.exports = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "Lỗi đăng xuất",
          error: err.message
        });
      }
  
      res.clearCookie("connect.sid");
      res.json({
        success: true,
        message: "Đăng xuất thành công"
      });
    });
  };