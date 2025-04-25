const express = require("express");
const session = require("express-session");
const path = require("path");
const searchRoute = require("./routes/search");
const cartRoute = require("./routes/cart");
const app = express();

const PORT = 3000;

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "ShopWeb")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ShopWeb", "index.html"));
});

app.use("/search", searchRoute);
app.use("/cart", cartRoute);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
