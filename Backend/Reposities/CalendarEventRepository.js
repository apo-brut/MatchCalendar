const mysql = require('mysql2');
var nconf = require('nconf');
const Logger = require("../Logger.js");
const Utils = require("../utils.js");

let user = "root";
let password = "";
let host = "localhost";
let database = "";

// Node logger
const logger = new Logger();

// Node Utils
const utils = new Utils();

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
  file: 'config.json'
});

if (nconf.get('matchCalender:enviroment') == "LOCAL") {
  user = nconf.get('sqlLOCAL:user');
  password = nconf.get('sqlLOCAL:password');
  host = nconf.get('sqlLOCAL:host');
  database = nconf.get('sqlLOCAL:database');
} else if (nconf.get('matchCalender:enviroment') == "LIVE") {
  user = nconf.get('sqlLIVE:user');
  password = nconf.get('sqlLIVE:password');
  host = nconf.get('sqlLIVE:host');
  database = nconf.get('sqlLIVE:database');
}

const connection = mysql.createConnection({
  host: host,
  user: user,
  database: database,
  password: password
});



class CalenderEventRepository {

  async GetCalendarEvents(UserId) {


     //Get app name by applicationID
      const CalenderEvents = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM `save` WHERE UserId = ?",
          [UserId],
          function (err, results, fields) {
            try {
              resolve(results);
            } catch {
              logger.writeErrorLog("[getCalenderEvents] Cannot get events from db | " + err)
              resolve("");
            }
          }
        );
      });
      
    return CalenderEvents;
   }

  async AddCalenderEvent(userid,start,end,title,description,color,date,matchID){
  

   connection.query("INSERT INTO `save`(`UserId`, `Date`, `Start`, `End`, `Title`, `Description`, `Color`, `calendar_type`, `matchID`) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? )",
    [userid,date,start,end,title,description,color,0,matchID],
    function (err, results, fields) {
      console.log(err);
    }
  );
 }

async DeleteCalenderEvent(Id) {
  connection.query("DELETE FROM `save` WHERE `ID` = ?",
    [Id],
    function (err, results, fields) {
   //   console.log(err);
    }
    );
}
async UpdateCalenderEvent(Id,start,end,title,description,color,calender_type,matchID){
  connection.query("UPDATE `save` SET `Date` = ?, `Start` = ?, `End` = ?, `Title` = ?, `Description` = ?, `Color`= ?, `calendar_type` = ?  WHERE Id = ?",
    [Id, utils.getCurrentDate(), start, end, title, description,color,0,matchID],
    function(err, results,fields) {
      // console.log(err);
    }
  )

}
}

    
module.exports = CalenderEventRepository; 

