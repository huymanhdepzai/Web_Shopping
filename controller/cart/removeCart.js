module.exports = (req, res) => {
    try {
      const { productId } = req.body;
      if (!productId) {
        return res.status(400).json({ success: false, message: "Thiếu productId" });
      }
  
      if (!req.session.cart) req.session.cart = [];
  
      req.session.cart = req.session.cart.filter(item => item.product._id.toString() !== productId);
  
      res.json({ success: true, message: "Đã xóa sản phẩm khỏi giỏ", cart: req.session.cart });
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
  };
  