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
           instanceName: 'SQLEXPRESS'

    },

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle,
      
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
  
db.employee =require("./employee")(sequelize, Sequelize,DataTypes,); 
db.appraisal =require("./appraisals")(sequelize, Sequelize,DataTypes);



// new  db.appraisal({
// });
// new db.apraisal_comments({
// });
// new db.employee({
// });

module.exports = db;