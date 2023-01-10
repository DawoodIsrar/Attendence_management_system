const express = require("express");
const router = express.Router();
const { QueryTypes } = require('sequelize');


router.get("/getAttendence",async (req,res)=>{
    let data =await db.sequelize.query('select * from USERINFO;',{
        type:QueryTypes.SELECT,
    })
    let response = {
        'all user informations': data
    }
   return res.status(200).json(response);
})
module.exports = router;