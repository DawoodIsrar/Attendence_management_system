module.exports = (sequelize, Sequelize,DataTypes) => {
    const Attendence = sequelize.define("appraisals", {
    

      appraisal:{
        type:DataTypes.STRING,
        allowNull:false
      },

    });
  
    return appraisals;
  };
  