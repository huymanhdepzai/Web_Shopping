const Product = require("../../models/Product");

module.exports = async (req, res) => {
    try {
        const allProducts = await Product.find().sort({ createdAt : -1});
        if (!allProducts) {
            return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
        }
        res.json({ success: true, allProducts });
    }
    catch (err){
        res.status(500).json({ success: false, message: "Lỗi máy chủ" });
    }
}