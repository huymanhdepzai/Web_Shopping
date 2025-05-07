const express = require("express");
const router = express.Router();

router.post("/add", (req, res) => {
  try {
    const productId = req.body.productId ? parseInt(req.body.productId) : NaN;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : NaN;

    if (isNaN(productId) || isNaN(quantity)) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Sản phẩm hoặc số lượng không phù hợp",
        });
    }
    const product = products.find((p) => p.id === productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    if (quantity <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Số lượng cần lớn hơn 0" });
    }
    const cartItem = {
      product: product,
      quantity: quantity,
      total: product.price * quantity,
    };
    const existingItem = req.session.cart.find((item) => item.id === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * existingItem.product.price;
    } else {
      req.session.cart.push(cartItem);
    }
    res.json({ success: true, message: "Đã thêm vào giỏ hàng" });
  } catch (err) {
    console.error("Lỗi thêm vào giỏ hàng: ", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
});

module.exports = router;
