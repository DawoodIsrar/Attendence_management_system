const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const app = express();
require('dotenv').config();
const secretKey = "cstAttendence";
// app.use(cors(corsOptions));

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
    return res.status(200).json(data);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

//get user name exist for attendence
  router.get("/getNamesandId",async (req,res)=>{
    try {
     let data =await db.sequelize.query('USE zkteco;select USERID,NAME from USERINFO;',{
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
  //get user info by id
  router.post("/getProfiledetailById",async (req,res)=>{
    try {
      //check is name exist or not
    //  let exist =  USERINFO.findOne({
    //     where: {
    //       NAME: req.body.NAME
    //     }
      
    //   })
   
      let data =await db.sequelize.query('USE zkteco;select * from USERINFO where USERID='+req.body.id,{
        type:QueryTypes.SELECT,
    })
    let response = {
        'user profile detail': data
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
  router.get("/getAttendeceById/:id",async (req,res)=>{
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
  //adding appraisal by employye name and id
  const appraisals = db.appraisal;
  router.post("/addAppraisals",async (req,res)=>{
    try {
      const exist = await employees.findOne({
        where:{
          name: req.body.name
        }
      })
     if(req.body != null && exist!=null){
     await  appraisals.create({
        understanding_job:req.body.understanding_job,
        fulfillment_job:req.body.fulfillment_job,
        capacity_work:req.body.capacity_work,
        quality_work:req.body.quality_work,
        learning_improvement:req.body.learning_improvement,
        communication:req.body.communication,
        responsibility:req.body.responsibility,
        initiative:req.body.initiative,
        motivation:req.body.motivation,
        adoptability:req.body.adoptability,
        reliability:req.body.reliability,
        team_work:req.body.team_work,
        punctuality:req.body.punctuality,
        presentation:req.body.presentation,
        politenesss_respect:req.body.politenesss_respect,
        interaction:req.body.interaction,
        interest_cst:req.body.interest_cst,
        contact_coordination:req.body.contact_coordination,
        understanding_job_comments:req.body.understanding_job_comments,
        fulfillment_job_comments:req.body.fulfillment_job_comments,
        capacity_work_comments:req.body.capacity_work_comments,
        quality_work_comments:req.body.quality_work_comments,
        learning_improvement_comments:req.body.learning_improvement_comments,
        communication_comments:req.body.communication_comments,
        responsibility_comments:req.body.responsibility_comments,
        initiative_comments:req.body.initiative_comments,
        motivation_comments:req.body.motivation_comments,
        adoptability_comments:req.body.adoptability_comments,
        reliability_comments:req.body.reliability_comments,
        team_work_comments:req.body.team_work_comments,
        punctuality_comments:req.body.punctuality_comments,
        presentation_comments:req.body.presentation_comments,
        politenesss_respect_comments:req.body.politenesss_respect_comments,
        interaction_comments:req.body.interaction_comments,
        interest_cst_comments:req.body.interest_cst_comments,
        contact_coordination_comments:req.body.contact_coordination_comments,
        general_remarks:req.body.general_remarks,
        objective_next:req.body.objective_next,
        proposal_staff:req.body.proposal_staff,
        employee_remarks:req.body.employee_remarks,
        evaluator_remarks:req.body.evaluator_remarks,
        ceo_commensts:req.body.ceo_commensts,
        e_id: exist.id   })
      return res.status(200).json({message:"Appraisal is added successfully"});
     }else{
      return res.status(500).json({message:"some fields are missing"})
     }
  
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

    //get appraisals record by user id
    router.get("/getAppraisalById/:id",async (req,res)=>{
      try {
        if(req.params.id!=null){
          let exist = await db.sequelize.query("USE zkteco;SELECT * from appraisals where employee_id="+req.params.id,{
            type:QueryTypes.SELECT,
          })
  
          if(exist!=null){
         return res.status(200).json(exist);
          }
        }
        else{
          return res.status(500).json("The given Employee id have no appraisal exist")
        }
      
      } catch (error) {
       return res.status(500).json({message:error.message})
      }
    });

  //update employee detail
  router.post("/updateEMployeeDetail",async (req,res)=>{
    try {
      let exist = await db.sequelize.query("USE zkteco;SELECT * from USERINFO where USERID="+req.body.id,{
        type:QueryTypes.SELECT,
      })
    if(exist!= null){
      await USERINFO.update({

        GENDER:req.body.GENDER,
      },
      {
        where: { USERID:exist.USERID,GENDER: null },
      }
      )
      return res.status(200).json("Employee detail updated successfully");
    }
    
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
  //add admin
  const employees = db.employee;
  const admins = db.admins;
  router.post("/addAdmin",async (req,res)=>{
    try {
    if(req.body != null){
     let exist = await admins.findOne({
      where:{
        name:req.body.name
      }
    })
     if(exist==null){
     await admins.create({
        name:req.body.name,
        email:req.body.email,
        password:bcrypt.hashSync(req.body.password, 8)
      })
      return res.status(200).json("Admin is added successfully");
     }else{
      return res.status(500).json("Sorry Admin already exists");
     }
    }
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

  //logIn Api
  router.post("/login",async(req,res)=>{
    await admins.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(admins => {
        if (!admins) {
          return res.status(404).send({ message: "User Not found." });
        }
  
        var passwordIsValid = bcrypt.compareSync(
          req.body.password,
          admins.password
        );
  
        if (!passwordIsValid) {
          return res.status(401).send({
            accessToken: null,
            message: "Invalid Password!"
          });
        }
  
      var token = jsonwebtoken.sign({employees}, secretKey,{
          expiresIn: 86400 // 24 hours
        });
          res.status(200).send({
            id: admins.id,
            username: admins.name,
            email: admins.email,
            accessToken: token
          });
       
      })
      
  })
//admin dashboard
router.post("/dashboard",verifyToken,(req,res)=>{
jsonwebtoken.verify(req.token,secretKey,(err,authData)=>{
if(err){
  return res.status(401).send("invalid token");
}else{
  res.status(200).json({message:"welcome to admin dashboard",authData});
}
})
})
//verify token function
function verifyToken(req,res,next){
    var bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader!== 'undefined'){
      const bearer = bearerHeader.split(" ");
      const token = bearer[1];
      req.token = token;
      next();
    }else{
     return  res.status(401).send("ivalid token")
    }
  }
  app.use(router);
  
  // simple route
  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome to attendence management system application." });
  });