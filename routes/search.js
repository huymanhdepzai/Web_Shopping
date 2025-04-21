const express = require('express');
const router = express.Router();

const products = [
  { id: 1, name: 'Giày Adidas Alpha', price: 1200, category: 'giay' },
  { id: 2, name: 'Giày Nike Air Max', price: 1500, category: 'giay' },
  { id: 3, name: 'Áo Hoodie Local Brand', price: 500, category: 'ao' },
  { id: 4, name: 'Quần Jogger nam', price: 700, category: 'quan' }
];

router.get('/', (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    let filtered = products;

    if (q) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase())
      );
    }
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
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
  } catch (err) {
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
});

module.exports = router;