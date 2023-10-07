const {
    Sequelize,
    DataTypes
} = require("sequelize");
const conn = require("../db").conn;

const Cart = conn.define(
    "Cart", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        namaBarang: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        hargaBarang: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalHarga: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        idBarang: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false, // Status default adalah false (belum selesai)
        },
    });

module.exports = Cart;