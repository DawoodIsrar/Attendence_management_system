const express = require("express");
const {Sequelize, DataTypes, QueryTypes} = require("sequelize");
module.exports = (sequelize, Sequelize,DataTypes) => {
    const salary = sequelize.define("salary", {
      basic_salary:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      overtime:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      bonus:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      deduction:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
    },
   {
    createdAt: false,
    updatedAt: false
   }
    );
  
    return salary;
  };
  