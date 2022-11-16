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


class CalenderMeet { 

    async AddCalenderMeet (ID, userId1, userId2) {
     connection.query ("INSERT INTO `meet`(`ID`, `UserId1`, `UserId2`) VALUES (?, ?, ?)",
     [ID,userId1,userId2],
     function (err, results, fields) {
    //   console.log(err);
     });
    }

    async DeleteCalenderMeet (ID, userId1, userId2) {
     connection.query ("DELETE * FROM `meet` WHERE ID = ?",
     [ID],
     function (err, results, fields) {
    //   console.log(err);
     });
    }

}