const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();
const router = require("./routes/index");
const connectDB = require("./config/db");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const MongoStore = require("connect-mongo");
require("dotenv").config()

const PORT = 3000 || process.env.PORT;

// Configure CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

app.use(
  session({
    secret: "your-secret-key", 
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24
    },
    store: MongoStore.create({
      mongoUrl: process.env.DATABASE_URL,
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60
    })
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/img', express.static(path.join(__dirname, 'img')));


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
