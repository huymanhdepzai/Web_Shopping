const Product = require("../../models/Product");

module.exports = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin hoặc số lượng không hợp lệ" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }



    const productData = product.toObject(); 
    const price = parseFloat(productData.price); 

    if (!req.session.cart) req.session.cart = [];

    const existingItem = req.session.cart.find(item => item.product._id.equals(productData._id));
    if (existingItem) {
      existingItem.quantity += parseInt(quantity); 
      existingItem.total = existingItem.quantity * price;
    } else {
      req.session.cart.push({
        product: productData,
        quantity: parseInt(quantity),
        total: parseInt(quantity) * price
      });
    }


    res.json({ success: true, message: "Đã thêm vào giỏ hàng", cart: req.session.cart });
  } catch (err) {
    console.error("Lỗi thêm vào giỏ:", err);
    res.status(500).json({ success: false, message: "Lỗi máy chủ" });
  }
};