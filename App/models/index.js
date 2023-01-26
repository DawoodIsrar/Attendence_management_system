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

    // pool: {
    //   max: config.pool.max,
    //   min: config.pool.min,
    //   acquire: config.pool.acquire,
    //   idle: config.pool.idle,
      
    // }
  }
);

const db = {};
module.exports = sequelize;
db.Sequelize = Sequelize;
db.sequelize = sequelize;
  
db.employees =require("./employee")(sequelize, Sequelize,DataTypes,); 
db.appraisal =require("./appraisals")(sequelize, Sequelize,DataTypes);
db.salary =require("./salary")(sequelize, Sequelize,DataTypes,); 
db.admins =require("./admins")(sequelize, Sequelize,DataTypes);

db.employees.hasOne(db.salary,{
  foreignKey:"e_id"
});
db.employees.hasOne(db.appraisal,{
  foreignKey:"e_id"
});
new db.admins({
});

module.exports = db;

