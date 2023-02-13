const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const app = express();
const config = require("./App/config/auth.config");
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
   initial();
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
          USERID: req.body.USERID,
          name:req.body.name
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
        USERID: exist.USERID  
       })
      return res.status(200).json({message:"Appraisal is added successfully"});
     }else{
      return res.status(500).json({message:"some fields are missing"})
     }
  
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });

    //get appraisals record by user USERID
    router.get("/getAppraisalById/:id",async (req,res)=>{
      try {
        if(req.params.id!=null){
          let exist = await db.sequelize.query("USE zkteco;SELECT * from appraisals where USERID="+req.params.id,{
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

      const ex =  await employees.findOne({
        where:{
          USERID:req.body.USERID,
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
        USERID:ex.USERID,
        month:req.body.month,
      }
      )
      return res.status(200).json("Employee salary added successfully");
    }else{
      return res.status(500).json("Employee not found")
    }
    
    } catch (error) {
     return res.status(500).json({message:"EMployee not exist"})
    }
  });
//update salary
 router.post("/updateSalary",async (req,res)=>{
  try {

    const ex =  await employees.findOne({
      where:{
        USERID:req.body.USERID,
        name: req.body.name,
      }
    })
    console.log(ex.USERID);
  if(ex!= null){
    await salary.findOne({
      where:{
      USERID:ex.USERID,
      month:req.body.month,
      }
    }).then(
   
        await salary.update({
          basic_salary:req.body.basic_salary,
        },
        {
          where:{USERID:ex.USERID,month:req.body.month}
        }
        )
      
    )
    return res.status(200).json("Employee salary updated successfully");
  }else{
    return res.status(500).json("Employee not found")
  }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get payslip record by user USERID, month
router.post("/getPaySlip",async (req,res)=>{
  try {
    const ex =  await salary.findOne({
      where:{
        USERID:req.body.USERID,
        month: req.body.month,
      }
    })
    if(ex!=null){
      let exist = await db.sequelize.query("USE zkteco;SELECT * from salaries where USERID="+req.params.id,{
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
//Add Addition to salary monthwise
router.patch("/updateAddition",async (req,res)=>{
  try {

    let ex =  await employees.findOne({
      where:{
        USERID:req.body.USERID,
        name:req.body.name
      }
    })
   if(ex!=null){
     const exs = salary.findOne({
      where:{
        USERID:req.body.USERID,
        month:req.body.month
      }
     })
      if(exs!= null){
        await salary.update({
          bonus:req.body.bonus,
        },
        {
          where:{USERID:ex.USERID,month:req.body.month}
        }
        )
        return res.status(200).json("Bonus is added to salary successfully");
      }else{
        return res.status(200).json("sorry employee salary of the require month is not availible")
      }
   }else{
    res.status(200).json("sorry the employee not found")
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
        USERID:req.body.USERID,
       name:req.body.name
      }
    })
   if(ex!=null){
    let exs =  await salary.findOne({
      where:{
        USERID:req.body.USERID,
       month:req.body.month
      }
    })
    if(exs!=null){
      await salary.update({
        overtime_rate:req.body.overtime_rate,
      },
      {
        where:{USERID:ex.USERID,month:req.body.month}
      }
      )
      return res.status(200).json("overtime rate is added to salary successfully");
    }else{
      return res.status(200).json("sorry employee salary of the require month is not availible")
    }
 }else{
  res.status(200).json("sorry the employee not found")
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
        USERID:req.body.USERID,
       name:req.body.name
      }
    })
   if(ex!=null){
    let exs =  await salary.findOne({
      where:{
        USERID:req.body.USERID,
       month:req.body.month
      }
    })
    if(exs!=null){
      await salary.update({
        deduction:req.body.deduction,
      },
      {
        where:{USERID:ex.USERID,month:req.body.month}
      }
      )
      return res.status(200).json("deduction is added to salary successfully");
    }else{
      return res.status(200).json("sorry employee salary of the require month is not availible")
    }
 }else{
  res.status(200).json("sorry the employee not found")
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
        USERID:req.body.USERID,
          name: req.body.name,
      }
    })
    let exs =  await salary.findOne({
      where:{
        USERID:req.body.USERID,
          
      }
    })
   if(ex!=null && req.body.date==null && exs!=null){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select overtime_rate from salaries where USERID="+ex.USERID,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select overtime_rate from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select overtime_rate from salaries where month=${req.body.date} and USERID=${ex.USERID}`,{
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
        USERID:req.body.USERID,
        name: req.body.name,
      }
    })
    let exs =  await salary.findOne({
      where:{
        USERID:req.body.USERID,
          
      }
    })
   if(ex!=null && req.body.date==null && exs!=null){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select deduction from salaries where USERID="+ex.USERID,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select deduction from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select deduction from salaries where month=${req.body.date} and USERID=${ex.USERID}`,{
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
        USERID:req.body.USERID,
          name: req.body.name,
      }
    })
    let exs =  await salary.findOne({
      where:{
        USERID:req.body.USERID
      }
    })
   if(ex!=null && req.body.date==null && exs!=null ){
    if(req.body.name!=null ){
      let exist = await db.sequelize.query("use zkteco;select bonus from salaries where USERID="+ex.USERID,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    } 
    }
    else if(req.body.name==null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select bonus from salaries where month=${req.body.date}`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(exist);
    }
    else if(ex!=null && req.body.date!=null && exs!=null){
      let exist = await db.sequelize.query(`use zkteco;select bonus from salaries where month=${req.body.date} and USERID=${ex.USERID}`,{
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
      name:req.body.name,
      USERID:req.body.USERID
    }
  })
   if(exist==null){
   await employees.create({
    // EmpId:req.body.EmpId,
      USERID:req.body.USERID,
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
    return res.status(500).json("Sorry employee having this USERID already exists");
   }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//update employees
router.post("/updateEmployees",async (req,res)=>{
  try {
  
   let exist = await employees.findOne({
    where:{
      USERID:req.body.USERID
    }
  })
   if(exist!=null){
   await employees.update({
    // EmpId:req.body.EmpId,
      USERID:req.body.USERID,
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
    },
    {
      where:{USERID:exist.USERID}
    }
    )
    return res.status(200).json("employee is added successfully");
   }else{
    return res.status(500).json("Sorry employee having this USERID is not exists");
   }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//show employee detail by name
router.get("/getProfiledetail/:id",async (req,res)=>{

  
  try {
    
    const exist = await employees.findOne({
      where:{
        USERID: req.params.USERID
      }
    })
      if(exist!==null){
      
        //SELECT * from public."LoanAndAdvances" where "EmpName" = 'waqas'
           const data =await db.sequelize.query('use zkteco;  select * from employees where USERID='+req.params.id,{
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
//get absent and present in this month by employee id
router.post("/getMonthlyAbsentOrPresent",async (req,res)=>{
  try {
 
      let absentPresent = await db.sequelize.query(`
      use zkteco;
WITH CTE AS (
SELECT
USERID,
MIN(CHECKTIME) AS CHECKTIME,
CAST(MIN(CHECKTIME) AS DATE) AS LogDate
FROM (
SELECT *, ROW_NUMBER() OVER(PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS RowNumber
FROM CHECKINOUT
WHERE CAST(CHECKTIME AS DATE) BETWEEN
DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0) AND GETDATE()
) AS Data
WHERE RowNumber = 1
GROUP BY USERID, CAST(CHECKTIME AS DATE)
),
CTE2 AS (
SELECT
USERID,
DATEDIFF(dd, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) + 1 - (DATEDIFF(wk, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) * 2) AS TotalDays
FROM USERINFO
GROUP BY USERID
)
SELECT
USERID,
NAME,
COUNT(DISTINCT LogDate) AS PresentDays,
TotalDays - COUNT(DISTINCT LogDate) AS AbsentDays
FROM
(
SELECT
USERINFO.USERID,
USERINFO.NAME,
LogDate,
CTE2.TotalDays
FROM USERINFO
JOIN CTE2 ON USERINFO.USERID = CTE2.USERID
LEFT JOIN CTE ON USERINFO.USERID = CTE.USERID
) AS AllData
where USERID=${req.body.USERID}
GROUP BY USERID, NAME, TotalDays
`,{
        type:QueryTypes.SELECT,
      })
      return res.status(200).json(absentPresent);
 
    
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get overtime of employee in current month by userid
router.get("/getEmployeeTOtalOvertime/:id",async (req,res)=>{
  try {
   
      let overtime = await db.sequelize.query(`
      use zkteco;
      WITH checkinout_grouped AS (
        SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
        FROM CHECKINOUT
        WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
        GROUP BY USERID, CAST(CHECKTIME AS DATE)
        )
        SELECT
        CONVERT(VARCHAR(5),
        DATEADD(minute,
        SUM(
        CASE
        WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) >= 480 THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
        ELSE 0
        END
        ),
        0),
        108) AS [Overtime (hh:mm)]
        FROM checkinout_grouped cin
        WHERE cin.USERID =${req.params.id}
        AND YEAR(cin.CheckDate) = YEAR(GETDATE())
        AND MONTH(cin.CheckDate) = MONTH(GETDATE())
        AND cin.CheckDate <= GETDATE();
        
        `,{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(overtime);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
  //add admin
  const employees = db.employees;
  const depart = db.departments;
  const admins = db.admins;
  const loanAndAdvances = db.loanAndAdvances;
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
     
        let salaries = await db.sequelize.query("  use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c INNER JOIN USERINFO as u ON c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '08:00:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I' ORDER BY CHECKTIME ASC;",{
          type:QueryTypes.SELECT,
        })
       return res.status(200).json(salaries);
    } catch (error) {
     return res.status(500).json({message:error.message})
    }
  });
  //api for refreshing input/output
  router.get("/getTodayAttendeelogs",async (req,res)=>{
    try {
     
        let query = await db.sequelize.query(`
        use zkteco;
WITH cte AS (
SELECT
USERID, CAST(CHECKTIME AS DATE) AS date, CHECKTIME,
ROW_NUMBER() OVER (PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS rn
FROM CHECKINOUT
)
UPDATE CHECKINOUT
SET CHECKTYPE =
CASE
WHEN rn = 1 THEN 'I'
ELSE 'O'
END
FROM cte
WHERE CHECKINOUT.USERID = cte.USERID AND CAST(CHECKINOUT.CHECKTIME AS DATE) = cte.date
AND CHECKINOUT.CHECKTIME = cte.CHECKTIME`,{
          type:QueryTypes.SELECT,
        })
       return res.status(200).json(query);
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
   
     const exist = await db.sequelize.query(" use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '08:00:00' AND CAST(CHECKTIME AS TIME) < '09:30:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I';",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(exist.length);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get count of today absent and present 
router.get("/getTodayAPresentAndAbsent",async (req,res)=>{
  try {
   
     const exist = await db.sequelize.query(" use zkteco;  WITH present_users AS (  SELECT USERID  FROM CHECKINOUT  WHERE CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE  SELECT COUNT(DISTINCT USERID) - (SELECT COUNT(*) FROM present_users) AS absent_user,        (SELECT COUNT(*) FROM present_users) AS present_user FROM USERINFO; ",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(exist);
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
//get employye current month attendence log by id
router.get("/getEmployyeAllLogs/:id",async (req,res)=>{
  try {
   
     const exist = await db.sequelize.query(`USE zkteco;
     WITH checkinout_grouped AS (
      SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
      FROM CHECKINOUT
      WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
      GROUP BY USERID, CAST(CHECKTIME AS DATE)
 )
 SELECT
      cin.USERID as [Employee ID],
      ui.NAME as [Employee Name],
    e.position,
    e.email,
      'Exit' AS CheckType,
      cin.CheckDate AS Date,
      FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
      FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time],
    CASE 
     WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) > 480 THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
     ELSE 0
    END AS [Overtime]
 FROM checkinout_grouped cin
 INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
 INNER JOIN employees as e ON cin.USERID = e.USERID
 WHERE cin.USERID=18
 ORDER BY cin.CheckDate DESC, cin.Checkin DESC, cin.Exit_time DESC
 OFFSET 1 ROWS;`,{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(exist);
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
//add loanAndAdvances
router.post("/addLoanAndAdvances",async (req,res)=>{
  try {
  
   let exist = await employees.findOne({
    where:{
      USERID:req.body.USERID
    }
  })
   if(exist!=null){
   if(req.body.type == 'Advance'){
    await loanAndAdvances.create({
      // EmpId:req.body.EmpId,
        USERID:req.body.USERID,
        name: req.body.name,
        date:req.body.date,
        amount:req.body.amount,
        type:req.body.type,
        deduction_type:null,
        advance_type:req.body.advance_type,
      })
      return res.status(200).json("Advance added successfully");
   }else if(req.body.type=='Loan'){
    await loanAndAdvances.create({
      // EmpId:req.body.EmpId,
        USERID:req.body.USERID,
        name: req.body.name,
        date:req.body.date,
        amount:req.body.amount,
        type:req.body.type,
        deduction_type:req.body.deduction_type,
        advance_type:null,
      })
      return res.status(200).json("Loan added successfully");
   }
   }else{
    return res.status(500).json("Sorry employee having this USERID not found");
   }
  
  } catch (error) {
   return res.status(500).json({message:error.message})
  }
});
const Role = db.role;
//Sign Up
router.post("/signUp",async (req, res) => {
  // Save User to Database
 try{
  const exist = await employees.findOne({
    where:{
      email:req.body.email
    }
  })
  if(exist==null){
    employees.create({
      USERID:req.body.USERID,
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
      password: bcrypt.hashSync(req.body.password, 8),
      retypepassword:bcrypt.hashSync(req.body.retypepassword, 8),
      d_id:req.body.d_id
    })
      .then(employees => {
        if (req.body.roles) {
          Role.findAll({
            where: {
              name: req.body.roles
            }
          }).then(roles => {
            user.setRoles(roles).then(() => {
              return res.send({ message: "User registered successfully!" });
            });
          });
        } else {
          // user role = 1
          employees.setRoles([1]).then(() => {
            return res.send({ message: "User registered successfully!" });
          });
        }
      })
      .catch(err => {
        console.log(err.message )
        return res.status(500).send({ message: err.message });
      });
  }else{
    return res.status(500).send({"message":"sorry user email already exist"})
  }
 }catch(err){
  return res.status(500).send({"message":err.message})
 }
})
//LogIn
router.post("/SecurelogIn", async (req, res) => {
  employees.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(employee => {
      if (!employee) {
        return res.status(404).send({ message: "Employee Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        employee.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jsonwebtoken.sign({ id: employee.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });

      var authorities = [];
      employee.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        res.status(200).send({
          id: employee.USERID,
          username: employee.name,
          email: employee.email,
          roles: authorities,
          accessToken: token
        });
      });
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
});

//add Departments
router.post("/addDepart", async (req, res) => {
  // Save User to Database
  depart.create({
    d_id: req.body.d_id,
    name: req.body.name,
    desc: req.body.desc
  }).then(res.status(200).send('department added successfully'))
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
    
});
//update department
router.patch("/updateDepart", async (req, res) => {
  // Save User to Database
  depart.update({
    name: req.body.name,
    desc: req.body.desc
  },{
    where:{
     id:req.body.id,
    }
  }).then(res.status(200).send('department updated successfully'))
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
    
});
//delete department
router.patch("/deleteDepart", async (req, res) => {
  // Save User to Database
  depart.findOne
  ({
    where:{
     id:req.body.id,
    }
  }).then(res.status(200).send('department deleted successfully'))
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
    
});
//get loanAndadvances
router.get("/getLoanAndAdvances",async (req,res)=>{
  try {
   
    const data = await db.sequelize.query("use zkteco; select s.*,e.name as [Employee Name] from salaries as s inner join employees as e on s.USERID = e.USERID ",{
        type:QueryTypes.SELECT,
      })
     return res.status(200).json(data);
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

  function initial() {
      // Role.create({
      //   id: 1,
      //   name: "user"
      // });
     
      // Role.create({
      //   id: 2,
      //   name: "hr"
      // });
     
      // Role.create({
      //   id: 3,
      //   name: "admin"
      // });
    }