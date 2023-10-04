const fs = require("fs");
const path = require("path");
const { conn, Product } = require("./db"); // Import koneksi database dan model Product dari file db.js

// Baca file JSON yang berisi data produk
const productsData = require("./static/assets/products.json"); // Ganti dengan path yang sesuai ke file JSON Anda

// Fungsi untuk memuat data produk ke dalam database
async function loadProducts() {
  try {
    // Sinkronisasi model dengan basis data
    await conn.sync();

    // Loop melalui data produk dan tambahkan setiap produk ke dalam database
    for (const productData of productsData.products) {
      await Product.create({
        category: productData.category,
        name: productData.name,
        price: productData.price,
        imageSrc: productData.imageSrc,
      });
    }

    console.log("Data produk telah dimuat ke dalam database.");
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
  } finally {
    // Tutup koneksi ke database
    await conn.close();
  }
}

// Panggil fungsi untuk memuat data produk
loadProducts();
