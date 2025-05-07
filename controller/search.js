const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    const { q, category, minPrice, maxPrice } = req.query;
    let filtered = products;

    if (q) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(q.toLowerCase()),
      );
    }
    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }
    if (minPrice) {
      filtered = filtered.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    }

    res.json({
      total: filtered.length,
      products: filtered,
    });
  } catch (err) {
    res.status(500).json({ message: "Search failed", error: err.message });
  }
});

module.exports = router;
