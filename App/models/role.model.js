module.exports = (sequelize, Sequelize,DataTypes) => {
    const Role = sequelize.define("roles", {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        // allowNull:false
      },
      role:{
        type:DataTypes.STRING,
        // allowNull:false
      }
    });
  
    return Role;
  };
  