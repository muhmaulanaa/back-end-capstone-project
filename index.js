const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const sequelize = require("sequelize");

// init express server and router
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cors());

const router = express.Router();
router.get("/", function (req, res, next) {
  res.redirect("http://localhost:3000/static/index.html");
});

// Endpoint untuk registrasi pengguna
router.post("/register", function (req, res, next) {
  if (
    req.body.username === "" ||
    req.body.password === "" ||
    req.body.email === ""
  ) {
    res.status(400).json({
      message: "EMPTY FIELD",
    });
    return;
  }

  db.user
    .create({
      username: req.body.username,
      password: req.body.password,
      email: req.body.email,
    })
    .then(function (data) {
      res.status(201).json({
        message: "User berhasil terdaftar",
        data: data,
      });
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

// Endpoint untuk login pengguna
router.post("/login", function (req, res, next) {
  if (req.body.username === "" || req.body.password === "") {
    res.status(400).json({
      message: "EMPTY FIELD",
    });
    return;
  }

  db.user
    .findOne({
      where: {
        username: req.body.username,
        password: req.body.password,
      },
    })
    .then(function (data) {
      if (data) {
        res.status(200).json({
          message: "Success login",
          data: data,
        });
      } else {
        res.status(401).json({
          message: "Login failed. Invalid credentials.",
        });
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(500).json({
        message: err,
      });
    });
});

module.exports = router;

// http router
app.use("/static", express.static(path.join(__dirname, "static")));
app.use("/", router);

const port = 3000;
app.listen(port, function () {
  db.conn
    .authenticate()
    .then(function () {
      console.log("Database terhubung");
    })
    .catch(function (err) {
      console.log("Database gagal terhubung karena:", err);
    });
  console.log("server start on", port);
});
