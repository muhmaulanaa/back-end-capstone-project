const { Sequelize, DataTypes } = require ("sequelize");
const conn = require("../db").conn;

const Checkout = conn.define(
    "Checkout",
    {
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
        },
        userId:{
            type:DataTypes.INTEGER,
            allowNull:false,
            references:{
                model:"user",
                key:"id",
            },
        },
        totalAmout:{
            type:DataTypes.DECIMAL(10,2),
            allowNull:false,
        },
        addres:{
            type:DataTypes.STRING,
            allowNull:false,
        },
        paymentMethod:{
            type:DataTypes.STRING,
            allowNull:false,
        },
    }
);

module.exports = Checkout;