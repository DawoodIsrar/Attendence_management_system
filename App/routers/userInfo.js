const express = require("express");
const router = express.Router();
const { QueryTypes } = require('sequelize');
router.get("/getAttendence",async (req,res)=>{
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
})
module.exports = router;