const Product = require("../../models/Product");

module.exports = async (req, res) => {
    try{
        const { productId } = req.params; 
        if (!productId) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin sản phẩm" });
        }
        const product = await Product.findById(productId);
        res.json({ success: true, product });
    }
    catch(err){
        res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
    }
}