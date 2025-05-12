module.exports = async (req, res) => {
  try {
    const cart = req.session.cart || [];
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0);
    res.json({ success: true, cart, totalAmount });
  } catch (err) {
    console.error("Lỗi lấy giỏ hàng:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
