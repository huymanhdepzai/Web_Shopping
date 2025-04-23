const session = require("express-session");
const express = require("express");
const { Router } = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

router.post("/add", (req, res) => {
  try {
    const productId = parseInt(req.body.productId);
    const quantity = parseInt(req.body.quantity);

    if (isNaN(productId) || isNaN(quantity)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid product ID or quantity" });
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Quantity must be greater than 0" });
    }
    const cartItem = {
      product: product,
      quantity: quantity,
      total: product * quantity,
    };
    const existingItem = req.session.cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.product.price;
    } else {
      req.session.cart.push(cartItem);
    }
    res.json({ success: true, message: "Items is added to cart" });
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng: ", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
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
