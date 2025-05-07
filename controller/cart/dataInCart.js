const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

router.get("/data", (req, res) => {
  try {
    const cart = [] || req.session.cart;
    const totalAmount = cart.reduce((sum, item) => sum + item.total, 0, 0);
    res.json({ cart, totalAmount });
  } catch (err) {
    console.error("Lỗi truy cập vào giỏ hàng");
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

module.exports = router;
