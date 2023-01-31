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
//database connection
db.sequelize.sync({force:false}).then(() => {
    console.log('database connected');
   
  });
//process.env.PORT || 
  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });

 
const { QueryTypes } = require('sequelize');

 //userInfo all detail
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
  router.get("/getName",async (req,res)=>{
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
const salary = db.salary;
  //Add salary
  router.post("/addSalary",async (req,res)=>{
    try {

      let ex =  await employees.findOne({
        where:{
          name: req.body.name,
        }
      })
    if(ex!= null){
      await salary.create({
        basic_salary:req.body.basic_salary,
        bonus:0,
        deduction:0,
        overtime_rate:0,
        overtime:0,
        month:req.body.month,
        e_id:ex.id
      }
      )
      return res.status(200).json("Employee salary added successfully");
    }else{
      return res.status(500).json("Employee not found")
    }
    
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

//Add Addition to salary monthwise
router.patch("/updateAddition",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null){
    let exs =  await salary.findOne({
      where:{
        e_id: ex.id,
        month:req.body.month
      }})
      if(exs!= null){
        await salary.update({
          bonus:req.body.bonus,
        },
        {
          where:{e_id:ex.id}
        }
        )
        return res.status(200).json("Bonus is added to salary successfully");
      }
   }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//add overtime monthwise
router.patch("/updateOvertimerate",async (req,res)=>{
  try {
    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null){
    let exs =  await salary.findOne({
      where:{
        e_id: ex.id,
        month:req.body.month
      }})
      if(exs!= null){
        await salary.update({
          overtime_rate:req.body.overtime_rate,
        },
        {
          where:{e_id:ex.id}
        }
        )
        return res.status(200).json("overtime rate is added to salary successfully");
      }
    }
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//add deduction month-wise
router.patch("/updatededuction",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null){
    let exs =  await salary.findOne({
      where:{
        e_id: ex.id,
        month:req.body.month
      }})
      if(exs!= null){
        await salary.update({
          deduction:req.body.deduction,
        },
        {
          where:{e_id:ex.id}
        }
        )
        return res.status(200).json("deduction is added to salary successfully");
      }else{
        res.status(500).json("Soory employee name or month of salary not found")
      }
    }else{
      return res.status(500).json("Sorry employee  not found");
    }
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});

//see Overtime by employee name or date or both
router.post("/showOvertime",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null && req.body.date==null){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select overtime_rate from salaries where e_id="+ex.id,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select overtime_rate from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select overtime_rate from salaries where month=${req.body.date} and e_id=${ex.id}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else{
      return res.status(500),json("sorry name or date is invalid")
    }
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//see deduction by employee name or date or both
router.post("/showDeduction",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null && req.body.date==null){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select deduction from salaries where e_id="+ex.id,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select deduction from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select deduction from salaries where month=${req.body.date} and e_id=${ex.id}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else{
      return res.status(500),json("sorry name or date is invalid")
    }
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//see bonus by employee name or date or both
router.post("/showBonus",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        name: req.body.name,
      }
    })
   if(ex!=null && req.body.date==null){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select bonus from salaries where e_id="+ex.id,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select bonus from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null){
      let exist = await db.sequelize.query(`use zkteco;select bonus from salaries where month=${req.body.date} and e_id=${ex.id}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else{
      return res.status(500),json("sorry name or date is invalid")
    }
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//add employees
router.post("/addEmployees",async (req,res)=>{
  try {
  
   let exist = await employees.findOne({
    where:{
      name:req.body.name
    }
  })
   if(exist==null){
   await employees.create({
    // EmpId:req.body.EmpId,
    name: req.body.name,
      gender:req.body.gender,
      contact:req.body.contact,
      address:req.body.address,
      email:req.body.email,
      position:req.body.position,
      birthday:req.body.birthday,
      verification:req.body.verification,  
       status:req.body.status,
      join_date:req.body.join_date,
      desc:req.body.desc,
    })
    return res.status(200).json("employee is added successfully");
   }else{
    return res.status(500).json("Sorry employee already exists");
   }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//show employee detail by id
router.get("/getProfiledetail/:id",async (req,res)=>{

  
  try {
    
    const exist = await employees.findOne({
      where:{
        id: req.params.id
      }
    })
      if(exist!==null){
      
        //SELECT * from public."LoanAndAdvances" where "EmpName" = 'waqas'
           const data =await db.sequelize.query('use zkteco;  select * from employees where id='+req.params.id,{
               type:QueryTypes.SELECT,
           })
           // let response = {
           //     'data': data
           // }
           return res.status(200).json(data);
      }
      else{
        return res.status(200).send({'message':"sorry the id you have given is not register"});
      }
    } catch (error) {
      return  res.status(500).send({'message':error.message})
    }
})

//all salaries
router.get("/getAllSalaries",async (req,res)=>{
  try {
   
      let salaries = await db.sequelize.query("use zkteco; select e.id,e.name,e.email,e.position,e.join_date,(salaries.basic_salary+salaries.bonus+(salaries.overtime*salaries.overtime_rate)-salaries.deduction) as total_salary FROM salaries inner join employees as e on salaries.e_id=e.id;",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(salaries);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
  //add admin
  const employees = db.employees;
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
 
  //get today attendence log
  router.get("/getTodayAttendeelogs",async (req,res)=>{
    try {
     
        let salaries = await db.sequelize.query("  use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '09:00:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I';",{
          type:QueryTypes.SELECT,
        })
       return res.status(200).json(salaries);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
//get tadays present on time
// router.get("/getTodayAttendeeOnTime",async (req,res)=>{
//   try {
   
//       let salaries = await db.sequelize.query(" use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '09:00:00' AND CAST(CHECKTIME AS TIME) < '09:30:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I';",{
//         type:QueryTypes.SELECT,
//       })
//      return res.status(200).json(salaries);
//   } catch (error) {
//    return res.status(500).json({message:error.message})
//   }
// });
//get tadays count and present on time
router.get("/getTodayAttendeeOnTimeCount",async (req,res)=>{
  try {
   
     const exist = await db.sequelize.query(" use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '09:00:00' AND CAST(CHECKTIME AS TIME) < '09:30:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I';",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(exist.length);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get employye current month attendence log by id
router.get("/getEmployyeAllLogs/:id",async (req,res)=>{
  try {
   
     const exist = await db.sequelize.query(`use zkteco;SELECT u.name,c.USERID,CONVERT(VARCHAR(10), c.CHECKTIME, 103) AS Date,CONVERT(VARCHAR(5), c.CHECKTIME, 108) AS Time,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u  on c.USERID = u.USERID WHERE   CAST(CHECKTIME AS TIME) > '08:00:00'  AND CHECKTYPE = 'I' AND c.USERID=${req.params.id}  GROUP BY CONVERT(VARCHAR(10), c.CHECKTIME, 103), u.name, c.USERID, c.CHECKTIME, c.CHECKTYPE;`,{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(exist.length);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get tadays late comers and present on time
router.get("/getTodayLateAttendeeCount",async (req,res)=>{
  try {
   
    const data = await db.sequelize.query("use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '09:30:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I'",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(data.length);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
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