const { Cart } = require('../models/cart');
const jwt = require('jsonwebtoken');

module.exports = {
  checkout: async (req, res) => {
    try {
      // Dapatkan data keranjang dari body request
      const { items } = req.body;
      
      // Validasi token
      const token = req.headers.authorization.split(' ')[1];
      try {
        const decodedToken = jwt.verify(token, 'secret');
        const userId = decodedToken.userId;
        
        // Hitung total harga dari item-item dalam keranjang
        const totalHarga = items.reduce((total, item) => {
          return total + (item.itemPrice * item.quantity); 
        }, 0);
        
        // Simpan data keranjang ke dalam database
        const cart = new Cart({ // Perbaikan di sini, buat objek Cart
          total_harga: totalHarga,
          userId: userId,
          items: items,
        });
        await cart.save(); // Perbaikan di sini, gunakan save() untuk menyimpan objek Cart

        res.status(201).json({
          message: 'Checkout berhasil!',
        });
      } catch (error) {
        return res.status(401).json({
          message: 'Token tidak valid atau kedaluwarsa.',
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Terjadi kesalahan saat checkout.',
      });
    }
  },
};
