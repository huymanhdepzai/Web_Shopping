const Product = require("../../models/Product");

module.exports = async (req, res) => {
    try{
        const { productName, description, price, category, brandName, productImage,createdAt, updatedAt } = req.body;
        if (!productName || !description || !price || !category || !brandName || !productImage) {
            return res.status(400).json({ success: false, message: "Thiếu thông tin sản phẩm" });
        }
        const newProduct = new Product({
            name: productName,
            description: description,
            price: price,
            category: category,
            brandName: brandName,
            productImage: productImage,
            createdAt: createdAt,
            updatedAt: updatedAt
        }); 
        await newProduct.save();
        res.json({ success: true, message: "Thêm sản phẩm thành công", productId: newProduct._id });
    }
    catch(err){
        res.status(500).json({ success: false, message: "Lỗi server", error: err.message });
    }
}