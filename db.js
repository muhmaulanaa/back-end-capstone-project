const sequelize = require("sequelize");
const mysql = require("mysql2");
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

module.exports = {
  conn,
  user,
};
