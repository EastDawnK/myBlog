require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");

const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.set("layout", "layouts/main");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "local-development-secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
};

if (process.env.MONGODB_URI) {
  sessionOptions.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
  });
}

app.use(session(sessionOptions));
app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  res.locals.databaseConnected = mongoose.connection.readyState === 1;
  next();
});

app.use("/", require("./routes/main"));
app.use("/posts", require("./routes/posts"));
app.use("/admin", require("./routes/admin"));
app.use("/admin/companies", require("./routes/companies"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
