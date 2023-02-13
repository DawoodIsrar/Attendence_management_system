const express = require("express");
const { Sequelize, DataTypes, QueryTypes } = require("sequelize");
module.exports = (sequelize, Sequelize, DataTypes) => {
  const employees = sequelize.define("employees", {
    USERID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    contact: {
      type: DataTypes.STRING,
      // allowNull:true,
      minlength: 11,
      maxlength: 11
    },

    address: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    email: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    position: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    birthday: {
      type: DataTypes.DATEONLY,
      // allowNull:false
    },
    verification: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    status: {
      type: DataTypes.STRING,
      // allowNull:false
    },

    join_date: {
      type: DataTypes.DATEONLY,
      // allowNull:false,
    },
    desc: {
      type: DataTypes.STRING,
      // allowNull:false
    },
    password: {
      type: Sequelize.STRING,
      allowNull:false,
      
    },
    retypepassword:{
      type: Sequelize.STRING,
      allowNull:true,
    },
    d_id:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  },
    {
      createdAt: false,
      updatedAt: false
    }
  );

  return employees;
};
