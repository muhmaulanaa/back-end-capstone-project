const { DataTypes } = require("sequelize");
const conn = require("../db").conn; // Import koneksi database

const Cart = conn.define("Cart", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  total_harga: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "user",
      key: "id",
    },
  },
  productId: {
    // Tambahkan kolom product_id
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Product", // Ganti "Product" dengan nama model Produk yang benar
      key: "id",
    },
  },
});

module.exports = {
  Cart,
};
