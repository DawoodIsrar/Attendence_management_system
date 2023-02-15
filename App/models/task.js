const { tasks } = require(".");

module.exports = (sequelize, Sequelize,DataTypes) => {
    const tasks = sequelize.define("Tasks", {
      // t_id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true
      // },
      name:{
        type:DataTypes.STRING,
        allowNull:false
      },
      desc: {
        type: DataTypes.STRING,
        allowNull:false
      },
      start:{
        type:DataTypes.DATEONLY,
        allowNull:false
        
      },
      end:{
        type:DataTypes.DATEONLY,
        allowNull:false
        
      },
      USERID: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }
    ,{
      createdAt: false,
      updatedAt: false
     }
    );
  
    return tasks;
  };
  