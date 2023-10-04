const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const sequelize = require("sequelize");
const bcrypt = require("bcrypt");

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

const saltRounds = 10; // Menentukan seberapa banyak putaran salt yang akan digunakan

// ...

// Endpoint untuk registrasi pengguna
router.post("/register", async function (req, res, next) {
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

  try {
    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    // Simpan data pengguna ke database, termasuk password yang sudah di-hash
    const userData = {
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword, // Password yang sudah di-hash
    };

    const data = await db.user.create(userData);

    res.status(201).json({
      message: "User berhasil terdaftar",
      data: data,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
});

// ...

// Endpoint untuk login pengguna
router.post("/login", async function (req, res, next) {
  if (req.body.username === "" || req.body.password === "") {
    res.status(400).json({
      message: "EMPTY FIELD",
    });
    return;
  }

  try {
    const userData = await db.user.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!userData) {
      res.status(401).json({
        message: "Login failed. Invalid credentials.",
      });
      return;
    }

    // Membandingkan password yang diterima dengan hash password di database
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      userData.password
    );

    if (passwordMatch) {
      res.status(200).json({
        message: "Success login",
        data: userData,
      });
    } else {
      res.status(401).json({
        message: "Login failed. Invalid credentials.",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: err,
    });
  }
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
