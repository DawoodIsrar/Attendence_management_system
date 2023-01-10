const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userinfo = require("./App/routers/userInfo")

// const controller = require("./app/controllers/auth.controller");
const app = express();
require('dotenv').config()
// var corsOptions = {
//   origin: "http://localhost:8080"
// };

// app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
db.sequelize.sync().then(() => {
    console.log('database connected');
   
  });

  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
  const { QueryTypes } = require('sequelize');

const router = express.Router();
  router.get("/getAttendence",async (req,res)=>{
      let data =await db.sequelize.query('select * from USERINFO;',{
          type:QueryTypes.SELECT,
      })
      let response = {
          'all user informations': data
      }
     return res.status(200).json(response);
  })
  app.use(router);
  // simple route
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to attendence management system application." });
  });