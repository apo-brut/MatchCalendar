/**
 * Some dummy code for @apo-brut
 */

const mysql = require('mysql2');
var nconf = require('nconf');

let user = "root";
let password = "";
let host = "localhost";
let database = "";

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


      //Get app name by applicationID
      const appName = await new Promise((resolve, reject) => {
        connection.query("SELECT `name` FROM `oauth_applications` WHERE `applicationID` = ?",
          [client_id],
          function (err, results, fields) {
            try {
              resolve(results[0]["name"]);
            } catch {
              logger.writeErrorLog("[/api/auth] Cannot get name from db |" + err)
              resolve("");
            }
          }
        );
      });


      //OR

      connection.query("INSERT INTO `token`(`token`, `identifier`, `accountID`, `date`) VALUES (?,?,?,?)",
      [auth_TokenHash, identifier, accountID, functions.getCurrentDate()],
      function (err, results, fields) {}
    );