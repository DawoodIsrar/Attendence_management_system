const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userinfo = require("./App/routers/userInfo")
const app = express();
require('dotenv').config()
pp.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
db.sequelize.sync({force:false}).then(() => {
    console.log('database connected');
   
  });
//process.env.PORT || 
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

  //userInfo all detail
const { QueryTypes } = require('sequelize');
const router =express.Router();
  router.get("/getUserInfo",async (req,res)=>{
    try {
     let data =await db.sequelize.query('USE zkteco;select * from USERINFO;',{
         type:QueryTypes.SELECT,
     })
     let response = {
         'all user informations': data
     }
    return res.status(200).json(response);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

//get user name exist for attendence
  router.get("/getNames",async (req,res)=>{
    try {
     let data =await db.sequelize.query('USE zkteco;select NAME from USERINFO;',{
         type:QueryTypes.SELECT,
     })
     let response = {
         'all user names': data
     }
    return res.status(200).json(response);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
//get total number of users exist
  router.get("/getTotleEmpCount",async (req,res)=>{
    try {
     let data =await db.sequelize.query('USE zkteco;select COUNT(*) from USERINFO',{
         type:QueryTypes.SELECT,
     })
    return res.status(200).json(data);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
  //get all attendence records of all employee
  router.get("/getAttendenceRecord",async (req,res)=>{
    try {
     let data =await db.sequelize.query("USE zkteco; SELECT cin.USERID,ui.NAME, CAST(cin.CHECKTIME AS DATE) AS 'CheckDate', CAST(cin.CHECKTIME AS TIME) AS 'Checkin' FROM CHECKINOUT AS cin  INNER JOIN USERINFO AS ui ON cin.USERID = ui.USERID WHERE cin.CHECKTYPE='I';",{
         type:QueryTypes.SELECT,
     })
    return res.status(200).json(data);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
  //get attendence record by user id
  router.get("/get/:id",async (req,res)=>{
    try {
      if(req.params.id!=null){
        let exist = await db.sequelize.query("USE zkteco;select USERINFO.NAME from USERINFO where USERINFO.USERID="+req.params.id,{
          
          type:QueryTypes.SELECT,
        })

        if(exist!=null){
          let data =await db.sequelize.query("USE zkteco; SELECT cin.USERID,ui.NAME, CAST(cin.CHECKTIME AS DATE) AS 'CheckDate', CAST(cin.CHECKTIME AS TIME) AS 'Checkin' FROM CHECKINOUT AS cin  INNER JOIN USERINFO AS ui ON cin.USERID = ui.USERID WHERE cin.CHECKTYPE='I' AND ui.USERID="+req.params.id,{
            type:QueryTypes.SELECT,
        })
       return res.status(200).json(data);
        }
      }
      else{
        return res.status(500).json("user not exist")
      }
    
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
  app.use(router);
  
  // simple route
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to attendence management system application." });
  });