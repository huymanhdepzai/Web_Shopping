const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const router = require("./routes/index");
const connectDB = require("./config/db");
const cors = require("cors");


const PORT = 3000 || process.env.PORT;

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "ShopWeb")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ShopWeb", "index.html"));
});

app.use("/api", router);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    console.log("Connected to MongoDB")
  });
}).catch((err) => console.error(err));

