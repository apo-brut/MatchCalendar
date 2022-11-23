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



class CalendarPersonRepository {
 
 async getUsernameByUserId(Id) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `Username` FROM `person` WHERE ID = ?",
      [Id],
      function (err, results, fields) {
        try {
          resolve(results[0]["Username"]);
        } catch {
          logger.error("[CalendarPersonRepository->getUsernameByUserId()] " + err);
          resolve("");
        }
      }
    );
  });
 }

 async getUserIdByUserName(username) {
  return await new Promise((resolve, reject) => {
    connection.query(
      "SELECT `ID` FROM `person` WHERE username = ?",
      [username],
      function (err, results, fields) {
        try {
          resolve(results[0]["ID"]);
        } catch {
          logger.error("[CalendarPersonRepository->getUserIdByUserName()] " + err);
          resolve("");
        }
      }
    );
  });
 }

}

module.exports = CalendarPersonRepository; 

