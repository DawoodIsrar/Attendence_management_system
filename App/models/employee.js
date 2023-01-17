const express = require("express");
module.exports = (sequelize, Sequelize,DataTypes) => {
    const employees = sequelize.define("employees", {
      name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      email:{
        type:DataTypes.STRING,
        allowNull:false
      },
      password:{
        type:DataTypes.STRING,
        allowNull:false
      },
      
    },
   {
    createdAt: false,
    updatedAt: false
   }
    );
  
    return employees;
  };
  