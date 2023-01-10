const config = require("../config/db.config.js");
const {Sequelize, DataTypes, QueryTypes} = require("sequelize");
const msnodesqlv8 = require("msnodesqlv8");
const sequelize = new Sequelize(
    config.DB,
  config.USER,
  config.PASSWORD,
  {
    server: config.SERVER,
    dialect: config.dialect,
    driver:msnodesqlv8,
    // operatorsAliases: false,
    option:{
           trustedConnection: true,
    },

    // pool: {
    //   max: config.pool.max,
    //   min: config.pool.min,
    //   acquire: config.pool.acquire,
    //   idle: config.pool.idle,
      
    // }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
  
db.leaves =require("../models/leave.js")(sequelize, Sequelize,DataTypes,); 
db.attendence =require("../models/attendece")(sequelize, Sequelize,DataTypes);

// db.leaves.hasOne(db.attendence,{
//     through: "attend_leave",
//   foreignKey: "lid",
//   otherKey: "aid"
// })


module.exports = db;