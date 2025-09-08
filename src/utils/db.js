"use strict";

require("dotenv/config");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

// console.log("Connecting to database...", sequelize, sequelize.options);

module.exports = sequelize;
