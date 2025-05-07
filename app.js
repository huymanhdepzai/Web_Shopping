const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/index");

mongoose
  .connect(
    ,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    },
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error(err));

const PORT = 3000;

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(express.json());
app.use(express.static(path.join(__dirname, "ShopWeb")));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "ShopWeb", "index.html"));
});

app.use("/api", router);
app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
