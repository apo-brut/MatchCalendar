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

  async AddCalenderPerson(Id,username,password,firstname,lastname,entry){

    connection.query("INSERT INTO `person`(`Username`, `Password`, `Firstname`, `Lastname`, `Entry`) VALUES (?, ?, ?, ?, ? )",
    [Id,username,password,firstname,lastname,entry],
    function (err, results, fields) {
      console.log(err);
    }
  );

    }

  async DeleteCalenderPerson(Id) {
    connection.query("DELETE * FROM `person` WHERE Id = ?",

    [Id,username,password,firstname,lastname,entry],
    function (err, results, fields) {
   //   console.log(err);
    }
    );
}



    async UpdateCalenderPerson(Id) {
        connection.query("UPDATE `person` SET `ID`='[value-1]',`Username`='',`Password`='',`Firstname`='',`Lastname`='',`Entry`='' WHERE ID = ?",
    
        [Id,username,password,firstname,lastname,entry],
        function (err, results, fields) {
       //   console.log(err);
        }
        );


 }
}
    




module.exports = CalendarPersonRepository; 

