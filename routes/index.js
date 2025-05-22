const express = require("express");
const router = express.Router();


const searchRoute = require("../controller/search");
const addToCartRoute = require("../controller/cart/addToCart");
const dataInCartRoute = require("../controller/cart/dataInCart");
const deleteItemInCartRoute = require("../controller/cart/removeCart");
const authToken = require("../middleware/authToken");
const loginRoute = require("../controller/user/login");
const registerRoute = require("../controller/user/signup");
const logoutRoute = require("../controller/user/logout");
const addProductRoute = require("../controller/product/addProduct");

//login
router.post("/login", loginRoute);
router.post("/signup", registerRoute);
router.get("/logout", logoutRoute)

//search
router.get("/search", searchRoute);

//cart
router.get("/cart/data", authToken, dataInCartRoute);
router.post("/cart/addToCart", authToken, addToCartRoute);
router.delete("/cart/delete", authToken, deleteItemInCartRoute);

//product
router.post("/product/addProduct", addProductRoute);

module.exports = router;
