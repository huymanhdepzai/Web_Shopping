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
const getCurrentUserRoute = require("../controller/user/getCurrentUser");
const addProductRoute = require("../controller/product/addProduct");
const getProductsRoute = require('../controller/product/getProduct');
const getProductDetailsRoute = require('../controller/product/getProductDetails');

//login
router.post("/login", loginRoute);
router.post("/signup", registerRoute);
router.get("/logout", logoutRoute)
router.get("/currentUser", authToken, getCurrentUserRoute);

//search
router.get("/search", searchRoute);

//cart
router.get("/cart/data", authToken, dataInCartRoute);
router.post("/cart/addToCart", authToken, addToCartRoute);
router.delete("/cart/delete", authToken, deleteItemInCartRoute);

//product
router.post("/product/addProduct", addProductRoute);
router.get("/product/getProduct", getProductsRoute);
router.get('/product/details/:productId', getProductDetailsRoute);

module.exports = router;
