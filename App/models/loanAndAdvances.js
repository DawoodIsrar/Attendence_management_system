const express = require("express");
const {Sequelize, DataTypes, QueryTypes} = require("sequelize");
module.exports = (sequelize, Sequelize,DataTypes) => {
    const loanAndAdvances = sequelize.define("loanAndAdvances", {
      name:{
        type:DataTypes.STRING,
        allowNull:false
      },
      date:{
        type:DataTypes.DATEONLY,
        allowNull:false
      },
      amount:{
        type:DataTypes.INTEGER,
        allowNull:false
      },
      type:{
        type:DataTypes.STRING,
        allowNull:false
      },
      deduction_type:{
        type:DataTypes.STRING,
        // allowNull:false
      },
      advance_type:{
        type:DataTypes.STRING,
        // allowNull:false
      },
      USERID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
   {
    createdAt: false,
    updatedAt: false
   }
    );
  
    return loanAndAdvances;
  };
  