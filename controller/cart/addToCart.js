const Product = require("../../models/Product");

module.exports = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    const product = await Product.findOne({ productId: productId });
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    if (!req.session.cart) req.session.cart = [];

    const existingItem = req.session.cart.find(item => item.productId === product.productId);
    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.total = existingItem.quantity * product.price;
    } else {
      req.session.cart.push({
        productId: product.productId,
        productName: product.productName,
        price: product.price,
        img: product.img,
        quantity,
        total: quantity * product.price,
        addedAt: new Date().toISOString()
      });
    }

    res.json({ success: true, message: "Đã thêm vào giỏ hàng", cart: req.session.cart });
  } catch (err) {
    console.error("Lỗi thêm vào giỏ:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};
