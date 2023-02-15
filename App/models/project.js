module.exports = (sequelize, Sequelize,DataTypes) => {
    const projects = sequelize.define("projects", {
      // p_id: {
      //   type: DataTypes.INTEGER,
      //   primaryKey: true
      // },
      name: {
        type: DataTypes.STRING,
        allowNull:false
      },
      desc:{
        type:DataTypes.STRING,
        allowNull:false
      },
      status:{
        type:DataTypes.STRING,
        allowNull:false
      },
      assignDate:{
        type:DataTypes.DATEONLY,
        allowNull:false
      },
      USERID: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
      
    }
    ,{
      createdAt: false,
      updatedAt: false
     }
    );
  
    return projects;
  };
  