require('dotenv').config()
module.exports = {
  SERVER:process.env.DB_SERVER,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASS,
  DB: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  driver:process.env.DB_DRIVER,
  // pool: {
  //   max: 5,
  //   min: 0,
  //   acquire: 30000,
  //   idle: 10000
  // }
};
