const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
const app = express();
const config = require("./App/config/auth.config")
require('dotenv').config();
const secretKey = "cstAttendence";
// var whitelist = ['http://localhost:3000']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials:true,            //access-control-allow-credentials:true
//   optionSuccessStatus:200
// }
// var whitelist = ['http://hrportal.cybersynctech.com', 'http://localhost:3000', 'http://localhost:8080']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   credentials: true,            //access-control-allow-credentials:true
//   optionSuccessStatus: 200

// }
// app.use(cors(corsOptions));


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./App/models");
//database connection
db.sequelize.sync({ force: false }).then(() => {
  console.log('database connected');
  // initial()
});
//process.env.PORT || 
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


const { QueryTypes } = require('sequelize');

//userInfo all detail
const router = express.Router();
router.get("/getUserInfo", async (req, res) => {
  try {
    let data = await db.sequelize.query('USE zkteco;select * from USERINFO;', {
      type: QueryTypes.SELECT,
    })
    let response = {
      'all user informations': data
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get employye current month attendence log by id
//get employye current month attendence log by id
router.get("/getEmployyeAllLogs/:id", async (req, res) => {
  try {

    const exist = await db.sequelize.query(`
    WITH checkinout_grouped AS (
      SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
      FROM CHECKINOUT
      WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
      GROUP BY USERID, CAST(CHECKTIME AS DATE)
      )
      SELECT
      cin.USERID as [Employee ID],
      ui.NAME as [Employee Name],
      COALESCE(e.position, 'NULL') AS Position,
      'Exit' AS CheckType,
      cin.CheckDate AS Date,
      FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
      FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time],
      CASE
      WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) > 480 THEN CONVERT(VARCHAR(5), DATEADD(minute, DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480, 0), 108)
      ELSE '00:00'
      END AS [Overtime],
      CASE
      WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) < 480 THEN CONVERT(VARCHAR(5), DATEADD(minute, 480 - DATEDIFF(minute, cin.Checkin, cin.Exit_time), 0), 108)
      ELSE '00:00'
      END AS [Remaining Hours]
      FROM checkinout_grouped cin
      INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
      LEFT JOIN employees as e ON cin.USERID = e.USERID
      WHERE cin.USERID=${req.params.id}
      ORDER BY cin.CheckDate DESC, cin.Checkin DESC, cin.Exit_time DESC
      OFFSET 1 ROWS;`, {
      type: QueryTypes.SELECT,
    })

    return res.status(200).json(exist);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get user name exist for attendence
router.get("/getName", async (req, res) => {
  try {
    let data = await db.sequelize.query('USE zkteco;select USERID,NAME from USERINFO;', {
      type: QueryTypes.SELECT,
    })
    let response = {
      'all_users': data
    }
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//show employee detail by name
router.get("/getProfiledetail/:id", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.params.id
      }
    })
    if (exist !== null) {
      //SELECT * from public."LoanAndAdvances" where "EmpName" = 'waqas'
      const data = await db.sequelize.query(`use zkteco;  select * from employees where USERID='${req.params.id}'`, {
        type: QueryTypes.SELECT,
      })
      // let response = {
      //     'data': data
      // }
      return res.status(200).json(data);
    }
    else {
      return res.status(200).send({ 'message': "sorry the id you have given is not register" });
    }
  } catch (error) {
    return res.status(500).send({ 'message': error.message })
  }
})
//get total number of users exist
router.get("/getTotleEmpCount", async (req, res) => {
  try {
    let data = await db.sequelize.query('USE zkteco;select COUNT(*) as totalEmp from USERINFO', {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get all attendence records of all employee
router.get("/getAttendenceRecord", async (req, res) => {
  try {
    let data = await db.sequelize.query("USE zkteco; SELECT cin.USERID,ui.NAME, CAST(cin.CHECKTIME AS DATE) AS 'CheckDate', CAST(cin.CHECKTIME AS TIME) AS 'Checkin' FROM CHECKINOUT AS cin  INNER JOIN USERINFO AS ui ON cin.USERID = ui.USERID WHERE cin.CHECKTYPE='I';", {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

//get attendence record by user id
router.get("/getAttendeceById/:id", async (req, res) => {
  try {
    if (req.params.id != null) {
      let exist = await db.sequelize.query("USE zkteco;select USERINFO.NAME from USERINFO where USERINFO.USERID=" + req.params.id, {

        type: QueryTypes.SELECT,
      })

      if (exist != null) {
        let data = await db.sequelize.query("USE zkteco; SELECT cin.USERID,ui.NAME, CAST(cin.CHECKTIME AS DATE) AS 'CheckDate', CAST(cin.CHECKTIME AS TIME) AS 'Checkin' FROM CHECKINOUT AS cin  INNER JOIN USERINFO AS ui ON cin.USERID = ui.USERID WHERE cin.CHECKTYPE='I' AND ui.USERID=" + req.params.id, {
          type: QueryTypes.SELECT,
        })
        return res.status(200).json(data);
      }
    }
    else {
      return res.status(500).json("user not exist")
    }

  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//adding appraisal by employye name and id
const appraisals = db.appraisal;
router.post("/addAppraisals", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.body.USERID,
        name: req.body.name
      }
    })
    if (req.body != null && exist !== null) {
      await appraisals.create({
        understanding_job: req.body.understanding_job,
        fulfillment_job: req.body.fulfillment_job,
        capacity_work: req.body.capacity_work,
        quality_work: req.body.quality_work,
        learning_improvement: req.body.learning_improvement,
        communication: req.body.communication,
        responsibility: req.body.responsibility,
        initiative: req.body.initiative,
        motivation: req.body.motivation,
        adoptability: req.body.adoptability,
        reliability: req.body.reliability,
        team_work: req.body.team_work,
        punctuality: req.body.punctuality,
        presentation: req.body.presentation,
        politenesss_respect: req.body.politenesss_respect,
        interaction: req.body.interaction,
        interest_cst: req.body.interest_cst,
        contact_coordination: req.body.contact_coordination,
        understanding_job_comments: req.body.understanding_job_comments,
        fulfillment_job_comments: req.body.fulfillment_job_comments,
        capacity_work_comments: req.body.capacity_work_comments,
        quality_work_comments: req.body.quality_work_comments,
        learning_improvement_comments: req.body.learning_improvement_comments,
        communication_comments: req.body.communication_comments,
        responsibility_comments: req.body.responsibility_comments,
        initiative_comments: req.body.initiative_comments,
        motivation_comments: req.body.motivation_comments,
        adoptability_comments: req.body.adoptability_comments,
        reliability_comments: req.body.reliability_comments,
        team_work_comments: req.body.team_work_comments,
        punctuality_comments: req.body.punctuality_comments,
        presentation_comments: req.body.presentation_comments,
        politenesss_respect_comments: req.body.politenesss_respect_comments,
        interaction_comments: req.body.interaction_comments,
        interest_cst_comments: req.body.interest_cst_comments,
        contact_coordination_comments: req.body.contact_coordination_comments,
        general_remarks: req.body.general_remarks,
        objective_next: req.body.objective_next,
        proposal_staff: req.body.proposal_staff,
        employee_remarks: req.body.employee_remarks,
        evaluator_remarks: req.body.evaluator_remarks,
        ceo_commensts: req.body.ceo_commensts,
        date: req.body.date,
        USERID: exist.USERID
      })
      return res.status(200).json({ message: "Appraisal is added successfully" });
    } else {
      return res.status(500).json({ message: "some fields are missing" })
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get appraisals record by user USERID
router.get("/getAppraisalById/:id", async (req, res) => {
  try {
    if (req.params.id != null) {
      let exist = await db.sequelize.query(`use zkteco;select e.name as [Employee Name] ,
      a.* from appraisals as a inner join employees as e on a.USERID=e.USERID where a.USERID =` + req.params.id, {
        type: QueryTypes.SELECT,
      })
      if (exist != null) {
        return res.status(200).json(exist);
      }
    }
    else {
      return res.status(500).json("The given Employee id have no appraisal exist")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get appraisals record by user USERID
router.get("/getAppraisalTable/:id", async (req, res) => {
  try {
    if (req.params.id != null) {
      let exist = await db.sequelize.query(`use zkteco; select e.name as [Employee Name] ,a.USERID as [Employee ID],a.date as Date from appraisals
       as a inner join employees as e on a.USERID=e.USERID where a.USERID =${req.params.id} order by Date DESC`, {
        type: QueryTypes.SELECT,
      })
      if (exist != null) {
        return res.status(200).json(exist);
      }
    }
    else {
      return res.status(500).json("The given Employee id have no appraisal exist")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//all salaries
const slip = db.slips;
router.post("/previousmonthslip",async(req,res)=>{
  try {
    //==============================================================================================//
    const emp = await employees.findOne({
      where:{
        name:req.body.name
      }
    })
    //==================Calculating remaining hours in current month till today date===============//
       //============================================================================================== //
    //Calculating remaining hours in current month till today date
    console.log(emp)
    if(emp!=null ){
      const date = req.body.month.split('-')
      const y =date[0]
      const mm= date[1]
     
        const days = new Date(date[0],date[1],0).getDate();
        console.log(days)
       const remainings = await db.sequelize.query(`
       USE zkteco;
       WITH checkinout_grouped AS (
             SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
             FROM CHECKINOUT
             WHERE CHECKTYPE IN ('I', 'O')
               AND USERID =${emp.USERID}
               AND CAST(CHECKTIME AS DATE) BETWEEN DATEFROMPARTS(${date[0]},${date[1]}, 1) AND CAST('${date[0]}/${date[1]}/${days}' AS DATE)
             GROUP BY USERID, CAST(CHECKTIME AS DATE)
           )
           SELECT
             cin.USERID AS [Employee ID],
             ui.NAME AS [Employee Name],
             COALESCE(e.position, 'NULL') AS Position,
             'Exit' AS CheckType,
             cin.CheckDate AS Date,
             FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
             FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time],
             CASE
               WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) > 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) - 480, 0), 108)
               ELSE '00:00'
             END AS [Overtime],
             CASE
               WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) < 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, 480 - DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time), 0), 108)
               ELSE '00:00'
             END AS [Remaining]
           FROM checkinout_grouped cin
           INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
           LEFT JOIN employees e ON cin.USERID = e.USERID
           ORDER BY cin.CheckDate DESC, cin.Checkin DESC, cin.Exit_time DESC
       ;
       `, {
         type: QueryTypes.SELECT,
       })
       
    
       let remaining = 0.0;
       let remaininghours = 0.0;
       let remainingminutes = 0.0;
       //remainningToatalHours
       let remainingtotalHour = 0.0;
       let ro;
       for (i = 0; i < remainings.length; i++) {
         ro = remainings[i].Remaining.split(':');
         remaininghours = parseFloat(ro[0]);
         remainingminutes = parseFloat(ro[1] / 60);
         remainingtotalHour = parseFloat(remaininghours + remainingminutes);
         remaining = remaining + remainingtotalHour
       }
      
       console.log("Total remaining hours:" + remaining)
        //============================================================================================== //
        //Calculating total overtime of current month till today date as a totalhour
     const overtime = await db.sequelize.query(`
     USE zkteco;
         WITH checkinout_grouped AS (
           SELECT
             USERID,
             CAST(CHECKTIME AS DATE) AS CheckDate,
             MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin,
             MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
           FROM CHECKINOUT
           WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
           GROUP BY USERID, CAST(CHECKTIME AS DATE)
         )
         SELECT
           CONVERT(VARCHAR(5),
             DATEADD(minute,
               SUM(
                 CASE
                   WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) >= 480
                   THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
                   ELSE 0
                 END
               ),
               0
             ),
             108
           ) AS [Overtime]
         FROM checkinout_grouped cin
         WHERE cin.USERID =${emp.USERID}
           AND YEAR(cin.CheckDate) = ${date[0]}
           AND MONTH(cin.CheckDate) = ${date[1]}
           AND cin.CheckDate <= CAST('${date[0]}/${date[1]}/${days}' AS DATE);
       ;
       `, {
           type: QueryTypes.SELECT,
         })
         console.log(overtime[0].Overtime)
         if(overtime[0].Overtime!= null && overtime[0].Overtime!=0){
           let overtime_hours = 0.0;
         let o;
         let overtime_minutes = 0.0;
         let overtime_totalHour = 0.0;
         o = overtime[0].Overtime.split(':');
         overtime_hours = parseFloat(o[0]);
         overtime_minutes = parseFloat(o[1] / 60);
         overtime_totalHour = parseFloat(overtime_hours + overtime_minutes);
         console.log("Total overtime hours:" + overtime_totalHour)
         }
         
 // //================================================================================================================== //
         // //================================================================================================================== //
     // //calculating total absent till today date by userid
     let absentPresent = await db.sequelize.query(`
     use zkteco;
     DECLARE @MonthDate DATE = '${date[0]}-${date[1]}-01';
    
        WITH CTE AS (
          SELECT 
            USERID, 
            MIN(CHECKTIME) AS CHECKTIME, 
            CAST(MIN(CHECKTIME) AS DATE) AS LogDate 
          FROM (
            SELECT *, 
              ROW_NUMBER() OVER(PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS RowNumber 
            FROM CHECKINOUT
            WHERE CAST(CHECKTIME AS DATE) BETWEEN DATEADD(mm, DATEDIFF(mm, 0, @MonthDate), 0) AND EOMONTH(@MonthDate)
          ) AS Data 
          WHERE RowNumber = 1 
          GROUP BY USERID, CAST(CHECKTIME AS DATE)
        ),
        CTE2 AS (
          SELECT USERID, 
            DATEDIFF(dd, DATEADD(mm, DATEDIFF(mm, 0, @MonthDate), 0), EOMONTH(@MonthDate)) + 1 - (DATEDIFF(wk, DATEADD(mm, DATEDIFF(mm, 0, @MonthDate), 0), EOMONTH(@MonthDate)) * 2) AS TotalDays
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
        WHERE USERID = ${emp.USERID}
        GROUP BY USERID, NAME, TotalDays;
     `, {
       type: QueryTypes.SELECT,
     })
     let absenties = absentPresent[0].AbsentDays;
     let present = absentPresent[0].PresentDays;
     console.log("Absent days"+absentPresent[0].AbsentDays)
     //========================================================================================================= //
      // //calculating total absent till today date by userid
     let basicSal = await db.sequelize.query(`
     use zkteco; select basic_salary from salaries where USERID =${emp.USERID}
       `, {
         type: QueryTypes.SELECT,
       })
       if(remaining==0 && overtime[0].Overtime==null && present==0 && emp.basic_salary==null){
         res.status(500).json("sorry there is no logs of employee on that monht")
       }else{
         let salpermonth = basicSal[0].basic_salary;
         let perDaySal = salpermonth/days;
         let salperHour = perDaySal/8;
         let over = overtime[0].Overtime 
         let deduction = (remaining*salperHour);
         let totalSal = salpermonth-deduction
         const dateee = (date[0]+"-"+date[1]+"-"+"1")
         console.log("saving date:"+dateee)
         // res.status(200).json({salpermonth,deduction,totalSal,absenties,remaining,over,present})
         //======================================================================================================//
        
     //add slip
         if (emp != null) {
           const year = date[0];
           const month =  date[1]; // Add 1 because getMonth() returns zero-based month index
           const daysInMonth = new Date(year, month, 0).getDate();
          console.log(daysInMonth)
           // function getWorkingDaysUntilDate(date,daysInMonth) {
           //   const today = date[0];
           //   const currentMonth = date[1];
           //   let workingDays = 0;
           //   // Iterate through each day of the month
           //   for (let day = 1; day <= daysInMonth; day++) {
           //     const currentDate = new Date(date[2], date[1], day);
           //     // Check if the current date is a weekend
           //     if (date[0] !== 0 && date[0] !== 6) {
           //       workingDays++;
           //     }
           //   }
           //   return workingDays;
           // }
           // // Example usage
           // // const currentDate = new Date();
           // const workingDaysUntilDate = getWorkingDaysUntilDate(date);
           // console.log(`There are ${workingDaysUntilDate} working days up to and including ${currentDate}`);
           //working days of month
           let workingDays = 0;
           if(daysInMonth==28){
             workingDays = 20
           }else if(daysInMonth == 29){
             workingDays =21
           }else if(daysInMonth == 30){
             workingDays =22
           }else if(daysInMonth == 31){
             workingDays =23
           }
           console.log(workingDays)
           //per day salary
           const perDaySal = salpermonth/daysInMonth;
           console.log(perDaySal)
           //per hour salary
           const perHourRate = perDaySal/8;
           console.log(perHourRate)
     
           //total hours in this month
           const totalHoursInMonth = (workingDays) * 8
           
           console.log("total hors till today date:"+totalHoursInMonth)
           //total hour works done in month
           const totalHourDone = totalHoursInMonth - remaining
           //total deduction absent + remaining hour
           // const deduction = (remaining * perHourRate) + (absentPresent[0].AbsentDays * perDaySal);
          // calculate the hour rate from basic salary
           // const date = ((now.getFullYear())+'/'+(now.getMonth()+1)).toString()
       // console.log(date);
       //   const d =date.split('-');
       //   const cumonth = parseFloat(d[1]);
         
     
     
       //     console.log(date)
            const totalOvertime = overtime[0].Overtime.split(':')
            const ot = parseFloat(totalOvertime[0])
            const mt = parseFloat(totalOvertime[1]/60)
            const to =parseFloat(ot+mt)
            console.log("reaminig:"+remaining+" overtime:"+to+"total hoour in month"+totalHoursInMonth+" total hours completed"+totalHourDone)
      console.log("hey date"+req.body.month)
           const exist = await slip.findOne({
             where:{
               month:dateee,
               USERID:emp.USERID
             }
           })
           
           if(exist==null){
             await slip.create({
               basic_salary: salpermonth,
               bonus: 0,
               deduction: deduction,
               overtime_rate:0,
               remainings_hours:remaining,
               total_hours_in_month:totalHoursInMonth,
               total_hours_completed_month:totalHourDone,
               absenties:absentPresent[0].AbsentDays,
               present_days:absentPresent[0].PresentDays,
               overtime:to,
               reason:null,
               USERID: emp.USERID,
               month:dateee,
               working_days_in_month:workingDays,
               working_days_till_today:workingDays,
               perDaySal:perDaySal,
               perHourSal:perHourRate,
               loanAndAdvances:0,
         
             })
             let salaries = await db.sequelize.query(`use zkteco
             select s.id as id,
                e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
                e.position as [Position],s.month as [Salary Month],s.basic_salary as [Basic Salary]
                  FROM slips as s
                  inner join employees as e on s.USERID=e.USERID
                where s.USERID = ${emp.USERID} AND s.month = '${date[0]}-${date[1]}-1'
                  ORDER BY s.id DESC`, {
               type: QueryTypes.SELECT,
             })
            return res.status(200).json(salaries);
           }else{
            
             let salaries = await db.sequelize.query(`use zkteco;
             select s.id as id,
                e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
                e.position as [Position],s.month as [Salary Month],s.basic_salary as [Basic Salary]
                  FROM slips as s
                  inner join employees as e on s.USERID=e.USERID
                where s.USERID = ${emp.USERID}  AND s.month = '${date[0]}-${date[1]}-1'
                  ORDER BY s.id DESC`, {
             type: QueryTypes.SELECT,
           })
           console.log(salaries)
         return res.status(200).json(salaries);
           }
         
         }
       
         
      
       }
     
     }else{
       res.status(500).json("sorry the employee is not existed")
     } 
      
      
   
    //get all employees userid and joining date
    // if(emp!=null){
    //   let i;
    //   let USERIDS = []
    //   let joinings=[]
    //   let remainsByMonth = []
      // for(i=0;i<emp.length;i++){
      //  USERIDS.push(emp[i].USERID)
      //  joinings.push(emp[i].join_date)
      //  const date = joinings[i].split('-')
      //  const days = new Date(date[0],date[1],0).getDate();
      //  console.log(days)
    
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
})

//get slip by id
router.get("/getslipById/:id",async(req,res)=>{
 try {
  const slipByID = await slip.findOne({
    where:{
      id:req.params.id
    }
  })
  if(slipByID!=null){
    let salaries = await db.sequelize.query(`use zkteco;
    select s.id as id,
       e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
       e.position as [Position],s.month as [Salary Month],
     s.basic_salary as [BasicSalary],(s.overtime * s.overtime_rate) as overtimePay, s.remainings_hours,s.total_hours_completed_month,s.total_hours_in_month,
       s.overtime as OvertimeHours,
       s.overtime_rate as OvertimeRate,
       ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)) as TotalSalary ,
       s.deduction,s.loanAndAdvances as loan,
       s.reason as Reason,
   (s.deduction+s.loanAndAdvances) as [Total Deduction],
       ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)-(s.deduction+s.loanAndAdvances)) as NetSalary
         FROM slips as s
         inner join employees as e on s.USERID=e.USERID
       where s.id = ${req.params.id}
         ORDER BY s.id DESC`, {
    type: QueryTypes.SELECT,
  })
    return res.status(200).json(salaries)
  }else{
    return res.status(500).json("sorry no slip found")
  }
 } catch (error) {
  return res.status(500).json(error.message)
 }
})
 
//Previous month slip
router.get("/precviosSal",async(req,res)=>{
  const salaries = await db.sequelize.query(`
  USE zkteco;
SELECT s.id,e.USERID as [Employee ID], e.name as [Employee Name], e.email as [Email], e.position as [Position], s.month as [Salary Month], s.basic_salary as [Basic Salary]
FROM slips as s
INNER JOIN employees as e ON s.USERID = e.USERID
WHERE s.month < DATEADD(month, DATEDIFF(month, 0, GETDATE()), 0)
    `, {
      type: QueryTypes.SELECT,
    })
    if(salaries!=null){
      res.status(200).json(salaries);
    }else{
      res.status(200).json("there is no salaries");
      console.log("there is no salaries")
    }
}) 

//slip for current month till the date in which it generate
router.get("/salarySlipformonth/:id", async (req, res) => {
  try {
    //============================================================================================== //
    //Calculating remaining hours in current month till today date
    const remainings = await db.sequelize.query(`
    USE zkteco;
    WITH checkinout_grouped AS (
          SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
          FROM CHECKINOUT
          WHERE CHECKTYPE IN ('I', 'O')
            AND USERID = ${req.params.id}
            AND CAST(CHECKTIME AS DATE) BETWEEN DATEFROMPARTS(YEAR(GETDATE()) , MONTH(GETDATE()), 1) AND CAST(GETDATE() AS DATE)
          GROUP BY USERID, CAST(CHECKTIME AS DATE)
        )
        SELECT
          cin.USERID AS [Employee ID],
          ui.NAME AS [Employee Name],
          COALESCE(e.position, 'NULL') AS Position,
          'Exit' AS CheckType,
          cin.CheckDate AS Date,
          FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
          FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time],
          CASE
            WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) > 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) - 480, 0), 108)
            ELSE '00:00'
          END AS [Overtime],
          CASE
            WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) < 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, 480 - DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time), 0), 108)
            ELSE '00:00'
          END AS [Remaining]
        FROM checkinout_grouped cin
        INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
        LEFT JOIN employees e ON cin.USERID = e.USERID
        ORDER BY cin.CheckDate DESC, cin.Checkin DESC, cin.Exit_time DESC
    ;
    `, {
      type: QueryTypes.SELECT,
    })
    let remaining = 0.0;
    let remaininghours = 0.0;
    let remainingminutes = 0.0;
    //remainningToatalHours
    let remainingtotalHour = 0.0;
    let ro;
    for (i = 0; i < remainings.length; i++) {
      ro = remainings[i].Remaining.split(':');
      remaininghours = parseFloat(ro[0]);
      remainingminutes = parseFloat(ro[1] / 60);
      remainingtotalHour = parseFloat(remaininghours + remainingminutes);
      remaining = remaining + remainingtotalHour
    }
    console.log("Total remaining hours:" + remaining)
    //======================================================================================================================== //
    //Calculating total overtime of current month till today date as a totalhour
    const overtime = await db.sequelize.query(`
USE zkteco;
    WITH checkinout_grouped AS (
      SELECT
        USERID,
        CAST(CHECKTIME AS DATE) AS CheckDate,
        MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin,
        MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
      FROM CHECKINOUT
      WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
      GROUP BY USERID, CAST(CHECKTIME AS DATE)
    )
    SELECT
      CONVERT(VARCHAR(5),
        DATEADD(minute,
          SUM(
            CASE
              WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) >= 480
              THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
              ELSE 0
            END
          ),
          0
        ),
        108
      ) AS [Overtime]
    FROM checkinout_grouped cin
    WHERE cin.USERID =${req.params.id}
      AND YEAR(cin.CheckDate) = YEAR(GETDATE())
      AND MONTH(cin.CheckDate) = MONTH(GETDATE())
      AND cin.CheckDate <= CAST(GETDATE() AS DATE);
  ;
  `, {
      type: QueryTypes.SELECT,
    })
    console.log(overtime[0].Overtime)
    let overtime_hours = 0.0;
    let o;
    let overtime_minutes = 0.0;
    let overtime_totalHour = 0.0;
    o = overtime[0].Overtime.split(':');
    overtime_hours = parseFloat(o[0]);
    overtime_minutes = parseFloat(o[1] / 60);
    overtime_totalHour = parseFloat(overtime_hours + overtime_minutes);
    console.log("Total overtime hours:" + overtime_totalHour)
    // //================================================================================================================== //
    // //calculating total absent till today date by userid
    let absentPresent = await db.sequelize.query(`
  use zkteco; WITH CTE AS ( SELECT USERID, MIN(CHECKTIME) AS CHECKTIME, CAST(MIN(CHECKTIME) AS DATE) AS LogDate FROM ( SELECT *, ROW_NUMBER() OVER(PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS RowNumber FROM CHECKINOUT
  WHERE CAST(CHECKTIME AS DATE) BETWEEN DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0) AND GETDATE()
  ) AS Data WHERE RowNumber = 1 GROUP BY USERID, CAST(CHECKTIME AS DATE)),
  CTE2 AS ( SELECT USERID, DATEDIFF(dd, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) + 1 - (DATEDIFF(wk, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) * 2) AS TotalDays
  FROM USERINFO GROUP BY USERID
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
  where USERID=${req.params.id}
  GROUP BY USERID, NAME, TotalDays;
    `, {
      type: QueryTypes.SELECT,
    })
    console.log("Total absent" + absentPresent[0].AbsentDays)
    const now = new Date();
    console.log("today "+(now.getMonth()+1)+'/'+now.getFullYear())
    //========================================================================================================= //
    //basic salary
    const empSal = await salary.findOne({
      where: {
        USERID: req.params.id
      }
    })
    console.log(empSal)
//add slip
    if (empSal != null) {
      const year = now.getFullYear();
      const month = now.getMonth() + 1; // Add 1 because getMonth() returns zero-based month index
      const daysInMonth = new Date(year, month, 0).getDate();
      const todaydate = now.getDate();
      function getWorkingDaysUntilDate(date) {
        const today = new Date();
        const currentMonth = today.getMonth();
        let workingDays = 0;
        // Iterate through each day of the month
        for (let day = 1; day <= date.getDate(); day++) {
          const currentDate = new Date(today.getFullYear(), currentMonth, day);
          // Check if the current date is a weekend
          if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
            workingDays++;
          }
        }
        return workingDays;
      }
      // Example usage
      const currentDate = new Date();
      const workingDaysUntilDate = getWorkingDaysUntilDate(currentDate);
      console.log(`There are ${workingDaysUntilDate} working days up to and including ${currentDate}`);
      //working days of month
      let workingDays = 0;
      if(daysInMonth==28){
        workingDays = 20
      }else if(daysInMonth == 29){
        workingDays =21
      }else if(daysInMonth == 30){
        workingDays =22
      }else if(daysInMonth == 31){
        workingDays =23
      }
      console.log(workingDays)
      //per day salary
      const perDaySal = empSal.basic_salary/daysInMonth;
      console.log(perDaySal)
      //per hour salary
      const perHourRate = perDaySal/8;
      console.log(perHourRate)

      //total hours in this month
      const totalHoursInMonth = (workingDaysUntilDate) * 8
      
      console.log("total hors till today date:"+totalHoursInMonth)
      //total hour works done in month
      const totalHourDone = totalHoursInMonth - remaining;
      //total deduction absent + remaining hour
      const deduction = (remaining * perHourRate) + (absentPresent[0].AbsentDays * perDaySal);
      //calculate the hour rate from basic salary
      let date;
      if(now.getMonth()<10){
         date = ((now.getFullYear())+'-0'+(now.getMonth()+1)+"-01").toString()
      }else{
         date = ((now.getFullYear())+'-'+(now.getMonth()+1)+"-01")}
  console.log(date);
    const d =date.split('-');
    const cumonth = parseFloat(o[1]);
    


      console.log(date)


      const exist = await slip.findOne({
        where:{
          month:date,
          USERID:req.params.id
        }
      })
      if(exist==null){
        await slip.create({
          basic_salary: empSal.basic_salary,
          bonus: 0,
          deduction: deduction,
          overtime_rate:0,
          remainings_hours:remaining,
          total_hours_in_month:totalHoursInMonth,
          total_hours_completed_month:totalHourDone,
          absenties:absentPresent[0].AbsentDays,
          present_days:absentPresent[0].PresentDays,
          overtime:overtime_totalHour,
          reason:null,
          USERID: empSal.USERID,
          month: date,
          working_days_in_month:workingDays,
          working_days_till_today:workingDaysUntilDate,
          perDaySal:perDaySal,
          perHourSal:perHourRate,
          loanAndAdvances:0,
    
        })
        let salaries = await db.sequelize.query(`use zkteco;
        select s.id as id,
           e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
           e.position as [Position],s.month as [Salary Month],
         s.basic_salary as [BasicSalary],(s.overtime * s.overtime_rate) as overtimePay, s.remainings_hours,s.total_hours_completed_month,s.total_hours_in_month,
           s.overtime as OvertimeHours,
           s.overtime_rate as OvertimeRate,
           ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)) as TotalSalary ,
           s.deduction,s.loanAndAdvances as loan,
           (s.absenties*s.perDaySal) as AbsentDeduction,
           s.reason as Reason,
       (s.deduction+s.loanAndAdvances+(s.absenties*s.perDaySal)) as [Total Deduction],
           ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)-(s.deduction+s.loanAndAdvances+(s.absenties*s.perDaySal))) as NetSalary
             FROM slips as s
             inner join employees as e on s.USERID=e.USERID
           where s.USERID = ${req.params.id} AND s.month= '${date}'
             ORDER BY s.id DESC`, {
          type: QueryTypes.SELECT,
        })
      return res.status(200).json(salaries);
      }else{
        await slip.update({
          basic_salary: empSal.basic_salary,
          // bonus: 0,
          deduction: deduction,
          // overtime_rate:0,
          remainings_hours:remaining,
          total_hours_in_month:totalHoursInMonth,
          total_hours_completed_month:totalHourDone,
          absenties:absentPresent[0].AbsentDays,
          present_days:absentPresent[0].PresentDays,
          overtime:overtime_totalHour,
          // reason:null,
          USERID: empSal.USERID,
          month: date,
          working_days_in_month:workingDays,
          working_days_till_today:workingDaysUntilDate,
          perDaySal:perDaySal,
          perHourSal:perHourRate,
          // loanAndAdvances:0,
        },
          {
            where: { USERID: exist.USERID, month: date}
          }
        )
        let salaries = await db.sequelize.query(`use zkteco;
      select s.id as id,
         e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
         e.position as [Position],s.month as [Salary Month],
       s.basic_salary as [BasicSalary],(s.overtime * s.overtime_rate) as overtimePay, s.remainings_hours,s.total_hours_completed_month,s.total_hours_in_month,
         s.overtime as OvertimeHours,
         s.overtime_rate as OvertimeRate,
         (s.absenties*s.perDaySal) as AbsentDeduction,
         ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)) as TotalSalary ,
         s.deduction,s.loanAndAdvances as loan,
         s.reason as Reason,
         s.bonus as Bonus,
        s.absenties as absent,
		 (s.deduction+s.loanAndAdvances + (s.absenties*s.perDaySal)) as [Total Deduction],
         ((s.perDaySal*s.present_days)+s.bonus+(s.overtime*s.overtime_rate)-(s.deduction+s.loanAndAdvances+ (s.absenties*s.perDaySal))) as NetSalary
           FROM slips as s
           inner join employees as e on s.USERID=e.USERID
         where s.USERID = ${req.params.id} AND s.month= '${date}'
           ORDER BY s.id DESC`, {
        type: QueryTypes.SELECT,
      })
    return res.status(200).json(salaries);
      }
    
    }
    //get slip
    
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
const salary = db.salary;
//Add salary
router.post("/addSalary", async (req, res) => {
  try {
    const ex = await employees.findOne({
      where: {
        name: req.body.name,
      }
    })
    const SalaryExist = await salary.findOne({
      where: {
        USERID: ex.USERID,
      }
    })
    // const overtime = await db.sequelize.query(`
    // USE zkteco;
    // WITH checkinout_grouped AS (
    //   SELECT
    //     USERID,
    //     CAST(CHECKTIME AS DATE) AS CheckDate,
    //     MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin,
    //     MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
    //   FROM CHECKINOUT
    //   WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
    //   GROUP BY USERID, CAST(CHECKTIME AS DATE)
    // )
    // SELECT
    //   CONVERT(VARCHAR(5),
    //     DATEADD(minute,
    //       SUM(
    //         CASE
    //           WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) >= 480
    //           THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
    //           ELSE 0
    //         END
    //       ),
    //       0
    //     ),
    //     108
    //   ) AS [Overtime]
    // FROM checkinout_grouped cin
    // WHERE cin.USERID =${req.body.USERID}
    //   AND YEAR(cin.CheckDate) = YEAR(GETDATE())
    //   AND MONTH(cin.CheckDate) = MONTH(GETDATE())
    //   AND cin.CheckDate <= CAST(GETDATE() AS DATE);
    //     `, {
    //   type: QueryTypes.SELECT,
    // })
    // console.log(overtime[0].Overtime);
    // const o = overtime[0].Overtime.split(':');
    // const hours = parseFloat(o[0]);
    // console.log(hours);
    // const minutes = parseFloat(o[1] / 60);
    // console.log(minutes);
    // const totalHour = parseFloat(hours + minutes);
    // console.log(totalHour);
    if (ex !== null && SalaryExist == null) {
      await salary.create({
        basic_salary: req.body.basic_salary,
        USERID: ex.USERID,
        month: req.body.month,
      })
      return res.status(200).json("Employee salary added successfully");
    } else {
      return res.status(500).json("Employee salary already exist ")
    }
  } catch (error) {
    return res.status(500).json({ message: "EMployee not exist" })
  }
});
//Add Addition to salary monthwise
router.patch("/updateAddition", async (req, res) => {
  try {
    let ex = await employees.findOne({
      where: {
        name: req.body.name
      }
    })
    if (ex != null) {
      const exs = salary.findOne({
        where: {
          USERID: ex.USERID,
        }
      })
      if(exs!=null){
        let slp = await slip.findOne({
          where: {
            USERID: ex.USERID,
            month: req.body.month
          }
        })
        if (slp != null) {
          await slip.update({
            bonus: req.body.bonus,
          },
            {
              where: { USERID: ex.USERID, month: req.body.month}
            }
          )
          return res.status(200).json("Bonus is added to salary successfully");
        } else {
          return res.status(200).json("sorry employee salary of the require month is not availible")
        }
      }else{
        return res.status(500).json("sorry employee salary  is not availible")
      }
    } else {
      res.status(200).json("sorry the employee not found")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//add overtime monthwise
router.patch("/updateOvertimeRate", async (req, res) => {
  try {
    let ex = await employees.findOne({
      where: {
        name: req.body.name
      }
    })
    if (ex != null) {
      const exs = salary.findOne({
        where: {
          USERID: ex.USERID,
        }
      })
      if(exs!=null){
        let slp = await slip.findOne({
          where: {
            USERID: ex.USERID,
            month: req.body.month
          }
        })
        if (slp != null) {
          await slip.update({
            overtime_rate: req.body.overtime_rate,
          },
            {
              where: { USERID: ex.USERID, month: req.body.month}
            }
          )
          return res.status(200).json("overtime rate is added to salary successfully");
        } else {
          return res.status(500).json("sorry employee salary of the require month is not availible")
        }
      }else{
        return res.status(500).json("sorry employee salary  is not availible")
      }
    } else {
      res.status(500).json("sorry the employee not found")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//add deduction month-wise
router.patch("/updateDeduction", async (req, res) => {
  try {
    let ex = await employees.findOne({
      where: {
        name: req.body.name
      }
    })
    if (ex != null) {
      const exs = salary.findOne({
        where: {
          USERID: ex.USERID,
        }
      })
      if(exs!=null){
        let slp = await slip.findOne({
          where: {
            USERID: ex.USERID,
            month: req.body.month
          }
        })
        if (slp != null && req.body.loanAndAdvances!=null && req.body.reason!=null) {
          await slip.update({
            loanAndAdvances: req.body.loanAndAdvances,
            reason:req.body.reason
          },
            {
              where: { USERID: ex.USERID, month: req.body.month}
            }
          )
          return res.status(200).json("deduction  is added to salary successfully");
        } else {
          return res.status(500).json("sorry employee salary of the require month is not availible")
        }
      }else{
        return res.status(500).json("sorry employee salary  is not availible")
      }
    } else {
      res.status(500).json("sorry the employee not found")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
router.get("/showOvertime", async (req, res) => {
  try {
    let exist = await db.sequelize.query(`use zkteco;
    select e.USERID as [Employee ID],e.name as [Employee Name],s.month as [Month], s.overtime_rate as Rate
    FROM slips as s inner join employees as e on s.USERID=e.USERID
    ORDER BY s.month DESC`, { 
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(exist);
    // }
    // else{
    //   return res.status(500),json("sorry name or date is invalid")
    // }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//see deduction by employee name or date or both
router.get("/showDeduction", async (req, res) => {
  try {
    let exist = await db.sequelize.query(`use zkteco;
    select e.USERID as [Employee ID],e.name as [Employee Name],s.month as [Deduction Month], s.deduction as Deduction FROM slips as s
    inner join employees as e on s.USERID=e.USERID
    ORDER BY s.month DESC`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(exist);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//see bonus by employee name or date or both
router.get("/showBonus", async (req, res) => {
  try {
    let exist = await db.sequelize.query(`use zkteco;
    select e.USERID as [Employee ID],e.name as [Employee Name],s.month as [Bonus Month], s.bonus as Bonus FROM slips as s
    inner join employees as e on s.USERID=e.USERID
    ORDER BY s.month DESC`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(exist);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get salary by id

//all salaries
router.get("/getAllSalariesByid/:id", async (req, res) => {
  try {

    let salaries = await db.sequelize.query(`use zkteco; 
    select e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],e.position as [Position],salaries.month as [Salary Month],(salaries.basic_salary+salaries.bonus+(salaries.overtime*salaries.overtime_rate)-salaries.deduction) as Salary 
    FROM salaries 
    inner join employees as e on salaries.USERID=e.USERID where salaries.USERID=${req.params.id}
    ORDER BY salaries.month DESC `, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(salaries);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//add employees
router.post("/addEmployees", async (req, res) => {
  try {
    let exist = await employees.findOne({
      where: {
        name: req.body.name,
        USERID: req.body.USERID
      }
    })
    if (exist == null) {
      await employees.create({
        // EmpId:req.body.EmpId,
        USERID: req.body.USERID,
        name: req.body.name,
        gender: req.body.gender,
        contact: req.body.contact,
        address: req.body.address,
        email: req.body.email,
        position: req.body.position,
        birthday: req.body.birthday,
        verification: req.body.verification,
        status: req.body.status,
        join_date: req.body.join_date,
        password:req.body.password,
        retypepassword:req.body.retypepassword,
        desc: req.body.desc,
        d_id:req.body.d_id
      })
      return res.status(200).json("employee is added successfully");
    } else {
      return res.status(500).json("Sorry employee having this USERID already exists");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//show employee detail by name
router.get("/getProfiledetail/:id", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.params.USERID
      }
    })
    if (exist !== null) {
      //SELECT * from public."LoanAndAdvances" where "EmpName" = 'waqas'
      const data = await db.sequelize.query('use zkteco;  select * from employees where USERID=' + req.params.id, {
        type: QueryTypes.SELECT,
      })
      // let response = {
      //     'data': data
      // }
      return res.status(200).json(data);
    }
    else {
      return res.status(200).send({ 'message': "sorry the id you have given is not register" });
    }
  } catch (error) {
    return res.status(500).send({ 'message': error.message })
  }
})
//get today attendence log
router.get("/getTodayAttendeelogs", async (req, res) => {
  try {
    let salaries = await db.sequelize.query(` USE zkteco;
      WITH checkinout_grouped AS (
      SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
      FROM CHECKINOUT
      WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
      GROUP BY USERID, CAST(CHECKTIME AS DATE)
      )
      SELECT
      cin.USERID as [Employee ID],
      ui.NAME as [Employee Name],
      FORMAT(cin.CheckDate, 'dd/MM/yy') AS Date,
      FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
      FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time]
      FROM checkinout_grouped cin
      INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
      WHERE  CAST(CheckDate AS DATE) = CAST(GETDATE() AS DATE)
      ORDER BY cin.CheckDate DESC, cin.Checkin ASC, cin.Exit_time ASC
      ;`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(salaries);
  } catch (error) {
    return res.status(500).json({ message: error.message })
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
router.get("/getTodayAttendeeOnTimeCount", async (req, res) => {
  try {
    const exist = await db.sequelize.query(" use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) > '08:00:00' AND CAST(CHECKTIME AS TIME) <= '09:15:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I';", {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(exist.length);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get tadays late comers and present on time
router.get("/getTodayLateAttendeeCount", async (req, res) => {
  try {
    const data = await db.sequelize.query("use zkteco; SELECT u.name,c.USERID,c.CHECKTIME,c.CHECKTYPE FROM CHECKINOUT as c inner join USERINFO as u on c.USERID = u.USERID WHERE CAST(CHECKTIME AS TIME) >= '09:16:00' AND CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE) AND CHECKTYPE = 'I'", {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data.length);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});


//all salaries
router.get("/getAllSalaries", async (req, res) => {
  try {
    let salaries = await db.sequelize.query(`use zkteco;
      select s.id as id, e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
    e.position as [Position],s.month as [Salary Month],s.basic_salary as [Basic Salary] from salaries as s
      inner join employees as e on s.USERID=e.USERID
      ORDER BY s.month DESC `, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(salaries);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//all salaries
router.get("/salarySlip/:id", async (req, res) => {
  try {

    let salaries = await db.sequelize.query(`use zkteco; 
    select salaries.id as id,salaries.basic_salary as [BasicSalary],(salaries.overtime*salaries.overtime_rate) as overtime, 
	salaries.overtime as OvertimeHours,
	salaries.overtime_rate as OvertimeRate,
	e.USERID as [Employee ID],e.name as [Employee Name],e.email as [Email],
	e.position as [Position],salaries.month as [Salary Month],
	(salaries.basic_salary+salaries.bonus+(salaries.overtime*salaries.overtime_rate)) as TotalSalary ,
	salaries.deduction,
  salaries.bonus as Bonus,
	salaries.reason as Reason,
	(salaries.basic_salary+salaries.bonus+(salaries.overtime*salaries.overtime_rate)-salaries.deduction) as NetSalary 
    FROM salaries 
    inner join employees as e on salaries.USERID=e.USERID
	where salaries.id = ${req.params.id}
    ORDER BY salaries.month DESC`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(salaries);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//add admin
const employees = db.employees;
const admins = db.admins;
router.post("/addAdmin", async (req, res) => {
  try {
    if (req.body != null) {
      let exist = await admins.findOne({
        where: {
          name: req.body.name
        }
      })
      if (exist == null) {
        await admins.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(req.body.password, 8)
        })
        return res.status(200).json("Admin is added successfully");
      } else {
        return res.status(500).json("Sorry Admin already exists");
      }
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});

//logIn Api
router.post("/login", async (req, res) => {
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

      var token = jsonwebtoken.sign({ employees }, secretKey, {
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
router.post("/dashboard", verifyToken, (req, res) => {
  jsonwebtoken.verify(req.token, secretKey, (err, authData) => {
    if (err) {
      return res.status(401).send("invalid token");
    } else {
      res.status(200).json({ message: "welcome to admin dashboard", authData });
    }
  })
})
//verify token function
function verifyToken(req, res, next) {
  var bearerHeader = req.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    return res.status(401).send("ivalid token")
  }
}
app.use(router);

// simple route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to attendence management system application." });
});
//update salary
router.patch("/updateSalary", async (req, res) => {
  try {
    const ex = await employees.findOne({
      where: {
        name: req.body.name,
      }
    })
    console.log(ex.USERID);
    if (ex != null) {
      await salary.findOne({
        where: {
          USERID: ex.USERID,
          month: req.body.month,
        }
      }).then(
        await salary.update({
          basic_salary: req.body.basic_salary,
        },
          {
            where: { USERID: ex.USERID, month: req.body.month }
          }
        )
      )
      return res.status(200).json("Employee salary updated successfully");
    } else {
      return res.status(500).json("Employee not found")
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});


//get count of today absent and present
router.get("/getTodayAPresentAndAbsent", async (req, res) => {
  try {
    const exist = await db.sequelize.query(`
     USE ZKTECO;
     WITH present_users AS 
       (  SELECT USERID  FROM CHECKINOUT  WHERE CAST(CHECKTIME AS DATE) = CAST(GETDATE() AS DATE)
       ) 
     SELECT COUNT(DISTINCT USERID) - (SELECT COUNT(*) FROM present_users) AS absent_user,
       (SELECT COUNT(*) FROM present_users) AS present_user FROM USERINFO;
     `, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(exist);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get absent and present in this month by employee id
router.post("/getMonthlyAbsentOrPresent", async (req, res) => {
  try {
    let absentPresent = await db.sequelize.query(`
      use zkteco; WITH CTE AS ( SELECT USERID, MIN(CHECKTIME) AS CHECKTIME, CAST(MIN(CHECKTIME) AS DATE) AS LogDate FROM ( SELECT *, ROW_NUMBER() OVER(PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS RowNumber FROM CHECKINOUT
WHERE CAST(CHECKTIME AS DATE) BETWEEN DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0) AND GETDATE()
) AS Data WHERE RowNumber = 1 GROUP BY USERID, CAST(CHECKTIME AS DATE)),
CTE2 AS ( SELECT USERID, DATEDIFF(dd, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) + 1 - (DATEDIFF(wk, DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0), GETDATE()) * 2) AS TotalDays
FROM USERINFO GROUP BY USERID
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
`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(absentPresent);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//update employees
router.post("/updateEmployees", async (req, res) => {
  try {
    let exist = await employees.findOne({
      where: {
        USERID: req.body.USERID
      }
    })
    if (exist != null) {
      await employees.update({
        // EmpId:req.body.EmpId,
        USERID: req.body.USERID,
        name: req.body.name,
        gender: req.body.gender,
        contact: req.body.contact,
        address: req.body.address,
        email: req.body.email,
        position: req.body.position,
        birthday: req.body.birthday,
        verification: req.body.verification,
        status: req.body.status,
        join_date: req.body.join_date,
        desc: req.body.desc,
      },
        {
          where: { USERID: exist.USERID }
        }
      )
      return res.status(200).json("employee is added successfully");
    } else {
      return res.status(500).json("Sorry employee having this USERID is not exists");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//api for refreshing input/output
router.get("/refreshData", async (req, res) => {
  try {
    let query = await db.sequelize.query(`
        use zkteco; WITH cte AS ( SELECT USERID, CAST(CHECKTIME AS DATE) AS date, CHECKTIME, ROW_NUMBER() OVER (PARTITION BY USERID, CAST(CHECKTIME AS DATE) ORDER BY CHECKTIME) AS rn FROM CHECKINOUT)UPDATE CHECKINOUT SET CHECKTYPE = CASE WHEN rn = 1 THEN 'I' ELSE 'O' END FROM cte WHERE CHECKINOUT.USERID = cte.USERID AND CAST(CHECKINOUT.CHECKTIME AS DATE) = cte.date AND CHECKINOUT.CHECKTIME = cte.CHECKTIME`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(query);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
const loanAndAdvances = db.loanAndAdvances;
//add loanAndAdvances
router.post("/addLoanAndAdvances", async (req, res) => {
  try {
    let exist = await employees.findOne({
      where: {
        USERID: req.body.USERID
      }
    })
    if (exist != null) {
      if (req.body.type == 'Advance') {
        await loanAndAdvances.create({
          // EmpId:req.body.EmpId,
          USERID: req.body.USERID,
          name: req.body.name,
          date: req.body.date,
          amount: req.body.amount,
          type: req.body.type,
          deduction_type: null,
          advance_type: req.body.advance_type,
        })
        return res.status(200).json("Advance is added successfully");
      } else if (req.body.type == 'Loan') {
        await loanAndAdvances.create({
          // EmpId:req.body.EmpId,
          USERID: req.body.USERID,
          name: req.body.name,
          date: req.body.date,
          amount: req.body.amount,
          type: req.body.type,
          deduction_type: req.body.deduction_type,
          advance_type: null,
        })
        return res.status(200).json("Loan is added successfully");
      }
    } else {
      return res.status(500).json("Sorry employee having this USERID not found");
    }
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get loanAndadvances
router.get("/getLoanAndAdvances", async (req, res) => {
  try {
    const data = await db.sequelize.query(`use zkteco;
    select la.*,e.name as [Employee Name] from loanAndAdvances as la inner join employees as e on la.USERID = e.USERID`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get loanAndadvances by id
router.get("/getLoanAndAdvancesById/:id", async (req, res) => {
  try {
    const data = await db.sequelize.query(`use zkteco;
    select la.*,e.name as [Employee Name] from loanAndAdvances as la inner join employees as e on la.USERID = e.USERID where la.USERID=${req.params.id}`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get overtime of employee in current month by userid
router.get("/getEmployeeTOtalOvertime/:id", async (req, res) => {
  try {
    let overtime = await db.sequelize.query(`
    USE zkteco;
    WITH checkinout_grouped AS (
      SELECT
        USERID,
        CAST(CHECKTIME AS DATE) AS CheckDate,
        MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin,
        MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
      FROM CHECKINOUT
      WHERE CHECKTYPE = 'I' OR CHECKTYPE = 'O'
      GROUP BY USERID, CAST(CHECKTIME AS DATE)
    )
    SELECT
      CONVERT(VARCHAR(5),
        DATEADD(minute,
          SUM(
            CASE
              WHEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) >= 480
              THEN DATEDIFF(minute, cin.Checkin, cin.Exit_time) - 480
              ELSE 0
            END
          ),
          0
        ),
        108
      ) AS [Overtime]
    FROM checkinout_grouped cin
    WHERE cin.USERID =${req.params.id}
      AND YEAR(cin.CheckDate) = YEAR(GETDATE())
      AND MONTH(cin.CheckDate) = MONTH(GETDATE())
      AND cin.CheckDate <= CAST(GETDATE() AS DATE);
        `, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(overtime);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//get remaining of employee in current month by userid
router.get("/getEmployeeTOtalRemaining/:id", async (req, res) => {
  try {
    const remainings = await db.sequelize.query(`
    USE zkteco;
    WITH checkinout_grouped AS (
          SELECT USERID, CAST(CHECKTIME AS DATE) AS CheckDate, MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin, MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
          FROM CHECKINOUT
          WHERE CHECKTYPE IN ('I', 'O')
            AND USERID = ${req.params.id}
            AND CAST(CHECKTIME AS DATE) BETWEEN DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) AND CAST(GETDATE() AS DATE)
          GROUP BY USERID, CAST(CHECKTIME AS DATE)
        )
        SELECT
          cin.USERID AS [Employee ID],
          ui.NAME AS [Employee Name],
          COALESCE(e.position, 'NULL') AS Position,
          'Exit' AS CheckType,
          cin.CheckDate AS Date,
          FORMAT(cin.Checkin, 'hh:mm') AS [Entry Time],
          FORMAT(cin.Exit_time, 'hh:mm') AS [Exit Time],
          CASE
            WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) > 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) - 480, 0), 108)
            ELSE '00:00'
          END AS [Overtime],
          CASE
            WHEN DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time) < 480 THEN CONVERT(VARCHAR(5), DATEADD(MINUTE, 480 - DATEDIFF(MINUTE, cin.Checkin, cin.Exit_time), 0), 108)
            ELSE '00:00'
          END AS [Remaining]
        FROM checkinout_grouped cin
        INNER JOIN USERINFO ui ON cin.USERID = ui.USERID
        LEFT JOIN employees e ON cin.USERID = e.USERID
        ORDER BY cin.CheckDate DESC, cin.Checkin DESC, cin.Exit_time DESC
    ;
    `, {
      type: QueryTypes.SELECT,
    })
    let remaining = 0.0;
    let remaininghours = 0.0;
    let remainingminutes = 0.0;
    //remainningToatalHours
    let remainingtotalHour = 0.0;
    let ro;
    for (i = 0; i < remainings.length; i++) {
      ro = remainings[i].Remaining.split(':');
      remaininghours = parseFloat(ro[0]);
      remainingminutes = parseFloat(ro[1] / 60);
      remainingtotalHour = parseFloat(remaininghours + remainingminutes);
      remaining = remaining + remainingtotalHour
    }
    // let overtime = await db.sequelize.query(`
    // use zkteco;
    // WITH checkinout_grouped AS (
    //   SELECT
    //     USERID,
    //     CAST(CHECKTIME AS DATE) AS CheckDate,
    //     MIN(CASE WHEN CHECKTYPE = 'I' THEN CHECKTIME END) AS Checkin,
    //     MAX(CASE WHEN CHECKTYPE = 'O' THEN CHECKTIME END) AS Exit_time
    //   FROM
    //     CHECKINOUT
    //   WHERE
    //     CHECKTYPE IN ('I', 'O')
    //     AND USERID = ${req.params.id}
    //     AND CHECKTIME <= GETDATE()
    //     AND CHECKTIME >= DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0)
    //   GROUP BY
    //     USERID,
    //     CAST(CHECKTIME AS DATE)
    // ),
    // total_hours AS (
    //   SELECT
    //     SUM(DATEDIFF(minute, '00:00:00', DATEADD(minute, 480, 0))) AS total_minutes
    //   FROM
    //     (SELECT DISTINCT CAST(CHECKTIME AS DATE) AS CheckDate
    //      FROM CHECKINOUT
    //      WHERE CHECKTYPE IN ('I', 'O')
    //      AND USERID = ${req.params.id}
    //      AND CHECKTIME <= GETDATE()
    //      AND CHECKTIME >= DATEADD(mm, DATEDIFF(mm, 0, GETDATE()), 0)) AS date_list
    // ),
    // overtime_hours AS (
    //   SELECT
    //     DATEDIFF(minute, '00:00:00', DATEADD(minute, SUM(DATEDIFF(minute, Checkin, Exit_time) - 480), 0)) AS overtime_minutes
    //   FROM
    //     checkinout_grouped
    //   WHERE
    //     DATEDIFF(minute, Checkin, Exit_time) < 480
    // )
    // SELECT
    //   CONVERT(VARCHAR(5), DATEADD(minute, overtime_hours.overtime_minutes, '00:00:00'), 108) AS [Overtime],
    //   CONVERT(VARCHAR(5), DATEADD(minute, total_hours.total_minutes - overtime_hours.overtime_minutes, '00:00:00'), 108) AS [Remaining]
    // FROM
    //   overtime_hours, total_hours;
    //     `, {
    //   type: QueryTypes.SELECT,
    // })
    return res.status(200).json(remaining);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
const Role = db.role;
//Sign Up
router.post("/signUpForEmployee", async (req, res) => {
  // Save User to Database
  try {
    const exist = await employees.findOne({
      where: {
        email: req.body.email,
      }
    });
    const depart = await departts.findOne({
      where: {
        name: req.body.depName
      }
    })

    if (exist == null && depart !== null && req.body.password == req.body.retypepassword) {

      employees.create({
        USERID: req.body.USERID,
        name: req.body.name,
        gender: req.body.gender,
        contact: req.body.contact,
        address: req.body.address,
        email: req.body.email,
        position: req.body.position,
        birthday: req.body.birthday,
        verification: req.body.verification,
        status: req.body.status,
        join_date: req.body.join_date,
        desc: req.body.desc,
        password: bcrypt.hashSync(req.body.password, 8),
        retypepassword: bcrypt.hashSync(req.body.retypepassword, 8),
        d_id: depart.id
      })
        .then(employees => {
          if (req.body.roles) {
            Role.findAll({
              where: {
                name: req.body.roles
              }
            }).then(roles => {
              employees.setRoles(roles).then(() => {
                return res.status(200).json({ message: "User registered successfully!" });
              });
            });
          } else {
            // user role = 1
            employees.setRoles([1]).then(() => {
              return res.status(200).json({ message: "User registered successfully!" });
            });
          }
        })
        .catch(err => {
          console.log(err.message)
          return res.status(500).send({ message: err.message });
        });
    } else {
      return res.status(500).send({ "message": "sorry user email already exist" })
    }
  } catch (err) {
    return res.status(500).send({ "message": err.message })
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
const depart = db.departments;
const departts = db.departments;
//add Departments
router.post("/addDepartment", async (req, res) => {
  // Save User to Database
  try {
    const exist = await departts.findOne({
      where: {
        name: req.body.name
      }
    })
    if (exist == null) {
      departts.create({
        name: req.body.name,
        description: req.body.description
      })
      return res.status(200).json("departments is added successfully")
    }
    else {
      return res.status(500).json("sorry departments name is already exist")
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }

});
//get the total departments number
router.get("/getTotalDepartCount", async (req, res) => {
  try {
    const { count, rows } = await depart.findAndCountAll({});
    return res.status(200).json(count);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//gett depart list
router.get("/getAllDepart", async (req, res) => {
  try {
    const department = await db.sequelize.query(`USE zkteco;

    SELECT id AS [Department ID], 
           d.name AS [Department Name], 
        d.description as Description from
          departs AS d
    ;`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(department);
  } catch (error) {
    return res.status(500).json({ message: error.message })
  }
});
//update department
router.patch("/updateDepart", async (req, res) => {
  // Save User to Database
  depart.update({
    name: req.body.name,
    description: req.body.description

  }, {
    where: {
      id: req.body.id,
    }
  }).then(res.status(200).send('department updated successfully'))
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
});
const projects = db.projects;
//addProject
router.post("/addProjects", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.body.USERID,
        name: req.body.EmpName,
      }
    })
    // Save projects to Database
    if (exist !== null) {
      projects.create({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        assignDate: req.body.assignDate,
        deadline: req.body.deadline,
        USERID: exist.USERID
      })
      return res.status(200).json({ message: "projects is added successfully" })
    }
    else {
      return res.status(500).json({ message: "sorry the employee is not ragister" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get projects by employee userid
router.get("/getProject/:id", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.params.id,
      }
    })
    if (exist !== null) {
      const project = projects.findOne({
        where: {
          USERID: exist.USERID,
        }
      })
      if (project != null) {
        const data = await db.sequelize.query(`USE zkteco;

      SELECT e.USERID AS [Employee ID], 
             e.name AS [Employee Name], 
             p.name AS [Project Name], 
             p.id ,
             p.assignDate AS [Assign Date], 
             p.deadline AS [Deadline], 
             p.status AS [Status] 
      FROM projects AS p
      LEFT JOIN employees AS e 
      ON e.USERID = p.USERID where p.USERID=${req.params.id}`, {
          type: QueryTypes.SELECT,
        })
        return res.status(200).json(data);
      } else {
        return res.status(500).json({ message: "sorry there is no project assign to this employee" })
      }
    } else {
      return res.status(500).json({ message: "sorry the employee name you enter is not ragister" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all projects
router.get("/getAllProjects", async (req, res) => {
  try {
    const data = await db.sequelize.query(`USE zkteco;

        SELECT e.USERID AS [Employee ID], 
               e.name AS [Employee Name], 
               p.name AS [Project Name], 
               p.id ,
               p.assignDate AS [Assign Date], 
               p.deadline AS [Deadline], 
               p.status AS [Status] 
        FROM projects AS p
        LEFT JOIN employees AS e 
        ON e.USERID = p.USERID;`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all projects by id
router.get("/getAllProjectsById", async (req, res) => {
  try {
    const data = await db.sequelize.query(`USE zkteco;

        SELECT e.USERID AS [Employee ID], 
               e.name AS [Employee Name], 
               p.name AS [Project Name], 
               p.id ,
               p.assignDate AS [Assign Date], 
               p.deadline AS [Deadline], 
               p.status AS [Status] 
        FROM projects AS p
        LEFT JOIN employees AS e 
        ON e.USERID = p.USERID where p.USERID=${req.params.id};`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all projects
router.get("/getAllProjectsCount/:id", async (req, res) => {
  try {
    const pro = await db.sequelize.query(`use zkteco; select * from  projects where USERID=${req.params.id}`, {
      type: QueryTypes.SELECT,
    })
    if (pro !== null) {
      return res.status(200).json(pro.length);
    } else {
      pro = 0;
      return res.status(200).json(pro);
    }

  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//update project
router.patch("/updateProject", async (req, res) => {
  // Save User to Database
  try {
    const exist = await projects.findOne({
      where: {
        id: req.body.id,
        USERID: req.body.USERID
      }
    })
    if (exist != null) {
      await projects.update({
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
        assignDate: req.body.assignDate,
        deadline: req.body.deadline,
        USERID: exist.USERID
      }, {
        where: {
          id: exist.id,
        }
      })
      return res.status(200).json("project updated successfully")
    } else {
      return res.status(500).json("project not found")
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//add task
const task = db.task;
router.post("/addTask", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.body.USERID,
        name: req.body.EmpName,

      }
    })
    // Save tasks to Database
    if (exist != null) {
      task.create({
        name: req.body.name,
        description: req.body.description,
        assignDate: req.body.assignDate,
        deadline: req.body.deadline,
        status: req.body.status,
        USERID: exist.USERID
      })
      return res.status(200).json({ message: "task is added successfully" })
    }
    else {
      return res.status(500).json({ message: "sorry the employee is not ragister" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//update task
router.patch("/updateTask", async (req, res) => {
  // Save User to Database
  try {
    const exist = await task.findOne({
      where: {

        id: req.body.id
      }
    })
    if (exist !== null) {
      await task.update({
        name: req.body.name,
        description: req.body.description,
        assignDate: req.body.assignDate,
        deadline: req.body.deadline,
        USERID: exist.USERID
      }, {
        where: {
          id: req.body.id,
        }
      })
      return res.status(200).json("Task updated successfully")
    } else {
      return res.status(500).json("Task not found")
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all projects
router.get("/getAlltaskCount/:id", async (req, res) => {
  try {
    const pro = await db.sequelize.query(`use zkteco; select * from  Tasks where USERID=${req.params.id}`, {
      type: QueryTypes.SELECT,
    })
    if (pro !== null) {
      return res.status(200).json(pro.length);
    } else {
      pro = 0;
      return res.status(200).json(pro);
    }

  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get tasks by employee userid
router.get("/getTask/:id", async (req, res) => {
  try {
    const exist = await employees.findOne({
      where: {
        USERID: req.params.id,
      }
    })
    if (exist != null) {
      const tasks = task.findOne({
        where: {
          USERID: exist.USERID,
        }
      })
      if (tasks != null) {
        const data = await db.sequelize.query(`USE zkteco;

        SELECT e.USERID AS [Employee ID], 
               e.name AS [Employee Name], 
               t.name AS [Task Name],
               t.description AS [Description] ,
               t.id ,
               t.assignDate AS [Assign Date], 
               t.deadline AS [Deadline], 
               t.status AS [Status] 
        FROM Tasks AS t
        LEFT JOIN employees AS e 
        ON e.USERID = t.USERID where t.USERID=${req.params.id}`, {
          type: QueryTypes.SELECT,
        })
        return res.status(200).json(data);
      } else {
        return res.status(500).json({ message: "sorry there is no Tasks assign to this employee" })
      }
    } else {
      return res.status(500).json({ message: "sorry the employee name you enter is not ragister" })
    }
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all tasks
router.get("/getAllTask", async (req, res) => {
  try {
    const data = await db.sequelize.query(`USE zkteco;

        SELECT e.USERID AS [Employee ID], 
               e.name AS [Employee Name], 
             t.id,
               t.name AS [Task Name], 
               t.assignDate AS [Assign Date], 
               t.deadline AS [Deadline], 
               t.status AS [Status] 
        FROM Tasks AS t
        LEFT JOIN employees AS e 
        ON e.USERID = t.USERID;`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message)
  }
});
//get all tasks
router.get("/getAllTaskOF/:id", async (req, res) => {
  try {
    const data = await db.sequelize.query(`USE zkteco;

        SELECT e.USERID AS [Employee ID], 
               e.name AS [Employee Name], 
             t.id,
               t.name AS [Task Name], 
               t.assignDate AS [Assign Date], 
               t.deadline AS [Deadline], 
               t.status AS [Status] 
        FROM Tasks AS t
        LEFT JOIN employees AS e 
        ON e.USERID = t.USERID where t.USERID=${req.params.id} && t.status="In Process";`, {
      type: QueryTypes.SELECT,
    })
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message)
  }
});

  // function initial() {
  //   Role.create({
  //     id: 1,
  //     name: "user"
  //   });
  //   Role.create({
  //     id: 2,
  //     name: "hr"
  //   });
  //   Role.create({
  //     id: 3,
  //     name: "admin"
  //   });
  // }