const Product = require("../models/Product");

module.exports = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (q) {
      filter.productName = { $regex: q, $options: 'i' };
    }

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      products
    });
  } catch (err) {
    console.error("Lỗi khi tìm kiếm:", err);
    res.status(500).json({ message: "Tìm kiếm thất bại", error: err.message });
  }
};