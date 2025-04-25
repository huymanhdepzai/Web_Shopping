const express = require("express");
const router = express.Router();

const products = [
  { id: 1, name: 'Giày Adidas Alpha', price: 1200, category: 'giay' },
  { id: 2, name: 'Giày Nike Air Max', price: 1500, category: 'giay' },
  { id: 3, name: 'Áo Hoodie Local Brand', price: 500, category: 'ao' },
  { id: 4, name: 'Quần Jogger nam', price: 700, category: 'quan' }
];

router.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  next();
});

router.post("/add", (req, res) => {
  try {
    
    const productId = req.body.productId ? parseInt(req.body.productId) : NaN;
    const quantity = req.body.quantity ? parseInt(req.body.quantity) : NaN;

    if (isNaN(productId) || isNaN(quantity)) {
      return res
        .status(400)
        .json({ success: false, message: "Sản phẩm hoặc số lượng không phù hợp" });
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
