const mysql = require('mysql2');
var nconf = require('nconf');
const Logger = require("../Logger.js");

let user = "root";
let password = "";
let host = "localhost";
let database = "";

// Node logger
const logger = new Logger();

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

      console.log(CalenderEvents);
      
    return CalenderEvents;
   }

  async AddCalenderEvent(userid,start,end,title,describtion,color){
  

   connection.query("INSERT INTO `save`(`UserId`, `Start`, `End`, `Title`, `Description`, `Color`) VALUES (?, ?, ?, ?, ?, ? )",
    [userid,start,end,title,describtion,color],
    function (err, results, fields) {
      console.log(err);
    }
  );
 }

async DeleteCalenderEvent(Id) {
  connection.query("DELETE * FROM `save` WHERE Id = ?",

    [Id],
    function (err, results, fields) {
   //   console.log(err);
    }
    );
}


}

    
module.exports = CalenderEventRepository; 

