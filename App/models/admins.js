const express = require("express");
const {Sequelize, DataTypes, QueryTypes} = require("sequelize");
module.exports = (sequelize, Sequelize,DataTypes) => {
    const admins = sequelize.define("admins", {
      
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
  
    return admins;
  };
  