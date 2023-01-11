module.exports = (sequelize, Sequelize,DataTypes) => {
    const employees = sequelize.define("employees", {
      name: {
        type: DataTypes.DATE,
        aloowNull:false
      },
      position:{
        type:DataTypes.STRING,
        aloowNull:false
      },
      email:{
        type:DataTypes.STRING,
        aloowNull:false
        
      },
      gender:{
        type:DataTypes.STRING,
        aloowNull:false
      }

    });
  
    return employees;
  };
  