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
db.loanAndAdvances =require("./loanAndAdvances")(sequelize, Sequelize,DataTypes);
db.task = require("./task")(sequelize, Sequelize,DataTypes);
db.projects = require("./project")(sequelize, Sequelize,DataTypes);
db.departments = require("./department")(sequelize, Sequelize,DataTypes);
db.role =require("./role.model")(sequelize, Sequelize,DataTypes);


db.role.belongsToMany(db.employees, {
  through: "employee_roles",
  foreignKey: "roleId",
  otherKey: "e_id"
});
db.employees.belongsToMany(db.role, {
  through: "employee_roles",
  foreignKey: "e_id",
  otherKey: "roleId",
});
// db.employees.hasOne(db.salary,{

// });
// db.employees.hasMany(db.projects,{
//   foreignKey:"eid",
// });
// new db.departments({

// });
// new db.appraisal({
// });
// new db.salary({
// });
// new db.admins({
// });
// new db.loanAndAdvances({
// });
// new db.task({
// });
// new db.projects({
// });
// new db.employees({
// });
module.exports = db;
// db.ROLES = ["user", "admin", "hr"];

