const express = require("express");
const router = express.Router();

const searchRoute = require("./controller/search");
const cartRoute = require("./controller/cart/addToCart");
const dataInCartRoute = require("./controller/cart/dataInCart");

router.get("/search", searchRoute);

//cart
router.get("/api/cart", cartRoute);
router.get("/api/cart/data", dataInCartRoute);
router.post("/api/cart/add", cartRoute);
