const express  = require('express');
const router = express.Router();
const Product = require('../models/Product');

const products = [
    { id: 1, name: 'Giày Adidas Alpha', price: 1200, category: 'giay' },
    { id: 2, name: 'Giày Nike Air Max', price: 1500, category: 'giay' },
    { id: 3, name: 'Áo Hoodie Local Brand', price: 500, category: 'ao' },
    { id: 4, name: 'Quần Jogger nam', price: 700, category: 'quan' }
  ];

  router.get('/', (req, res) => {
    const {
      q,
      category,
      minPrice,
      maxPrice
    } = req.query;
  
    let filtered = products;
  
    // Lọc theo từ khóa
    if (q) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
    }
  
    // Lọc theo danh mục
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
  
    // Lọc theo khoảng giá
    if (minPrice) {
      filtered = filtered.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(p => p.price <= Number(maxPrice));
    }
  
    res.json({
      total: filtered.length,
      products: filtered
    });
  });
// router.get('/', async (req, res) => {
//     const {
//         q,
//         category,
//         brand,
//         minPrice,
//         maxPrice,
//         page = 1,
//         limit = 10
//       } = req.query;
    
//     const filters = {};

//       if (q) {
//         filters.name = { $regex: q, $options: 'i' }; // tìm gần đúng, không phân biệt hoa/thường
//       }
    
//       if (category) filters.category = category;
//       if (brand) filters.brand = brand;
//       if (minPrice || maxPrice) {
//         filters.price = {};
//         if (minPrice) filters.price.$gte = Number(minPrice);
//         if (maxPrice) filters.price.$lte = Number(maxPrice);
//       }
    
//       try {
//         const products = await Product.find(filters)
//           .skip((page - 1) * limit)
//           .limit(Number(limit));
    
//         const total = await Product.countDocuments(filters);
    
//         res.json({
//           total,
//           page: Number(page),
//           limit: Number(limit),
//           products
//         });
//       } catch (err) {
//         res.status(500).json({ message: 'Search failed', error: err });
//       }
//     });

    module.exports = router;
