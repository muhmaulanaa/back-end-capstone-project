const sequelize = require("sequelize");
const mysql = require("mysql2");
const db = require("./db"); // Import model "Product"
const fs = require("fs");
const path = require("path");

const conn = new sequelize.Sequelize(
  "mysql://avnadmin:AVNS_2vZNlzaU8jgJHV4rR1a@mysql-5a21497-sqlcapstoneproject123.aivencloud.com:28805/defaultdb?ssl-mode=REQUIRED",
  {
    ssl: fs.readFileSync(path.join(__dirname, "group1.pem")),
    dialect: "mysql",
    logging: false,
  }
);

const user = conn.define(
  "user",
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: { type: sequelize.DataTypes.STRING, allowNull: false },
    password: { type: sequelize.DataTypes.STRING, allowNull: false },
    email: { type: sequelize.DataTypes.INTEGER, allowNull: false },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const Product = conn.define(
  "Product",
  {
    id: {
      type: sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    category: { type: sequelize.DataTypes.STRING, allowNull: false },
    name: { type: sequelize.DataTypes.STRING, allowNull: false },
    price: { type: sequelize.DataTypes.INTEGER, allowNull: false },
    imageSrc: { type: sequelize.DataTypes.STRING, allowNull: false },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Baca file JSON
const rawData = fs.readFileSync(".static/assets/products.json");
const productsData = JSON.parse(rawData);

// Membuat array yang berisi objek-objek Product dari data JSON
const products = productsData.map((product) => ({
  category: product.category,
  name: product.name,
  price: product.price,
  imageSrc: product.imageSrc,
}));

// Synchronize model "Product" dengan database
db.Product.sync()
  .then(() => {
    // Memasukkan data produk ke dalam tabel "Product"
    return db.Product.bulkCreate(products);
  })
  .then(() => {
    console.log('Data produk berhasil dimuat ke dalam tabel "Product".');
  })
  .catch((err) => {
    console.error(
      "Error syncing Product model atau memasukkan data produk:",
      err
    );
  });

module.exports = {
  conn,
  user,
  Product,
};
