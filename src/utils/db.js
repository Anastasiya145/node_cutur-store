"use strict";

require("dotenv/config");
const pg = require("pg");
const { Sequelize } = require("sequelize");

const { DB_HOST, DB_NAME, DB_USERNAME, DB_DIALECT, DB_PASSWORD, DB_PORT } = process.env;

const client = new Sequelize({
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USERNAME,
  dialect: DB_DIALECT,
  dialectModule: pg,
  password: DB_PASSWORD,
  port: DB_PORT,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = client;
