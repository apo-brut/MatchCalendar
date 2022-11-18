const mysql = require("mysql2");
var nconf = require("nconf");
const Logger = require("../Logger.js");
const Utils = require("../utils.js");
const bcrypt = require("bcrypt");

// Node Utils
const utils = new Utils();

// Node logger
const logger = new Logger(false);

let user = "root";
let password = "";
let host = "localhost";
let database = "exposeweb";

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
  file: "config.json",
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
  password: password,
});

class AccountRepository {
  async Signup(username, email, password) {
    let code = Math.floor(100000 + Math.random() * 900000);
    let currenDate = utils.getCurrentDate();
    let password_hash = await utils.genHash(password);
    connection.query(
      "INSERT INTO `person`(`Username`, `Email`, `Password`, `Firstname`, `Lastname`, `Entry`) VALUES (?,?,?,?,?,?)",
      [username, email, password_hash, "", "", currenDate],
      function (err, results, fields) {
        if (err != null) {
          logger.error("[AccountRepository->signup()] " + err);
        }
      }
    );
  }

  async Login(email, password) {
    let token = await utils.generateToken();
    let identifier = await utils.generateToken();

    //Get pw hash by email
    const password_hash = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT `Password` FROM `person` WHERE `Email` = ?",
        [email],
        function (err, results, fields) {
          try {
            resolve(results[0]["Password"]);
          } catch {
            logger.error("[AccountRepository->login()] " + err);
            resolve("");
          }
        }
      );
    });

    //check password hashes
    const result_bcrypt = bcrypt.compareSync(password, password_hash);

    if (!result_bcrypt) {
      return ["", ""];
    }

    let currenDate = utils.getCurrentDate();

    //Get userID by email
    let userID = await this.GetUserIDByEmail(email);

    if (userID == undefined) {
      return ["", "", userID];
    }

    let token_hash = await utils.genHash(token);
    connection.query(
      "INSERT INTO `auth_token`(`auth_token`, `identifier`, `userID`, `date`) VALUES (?,?,?,?)",
      [token_hash, identifier, userID, currenDate],
      function (err, results, fields) {
        if (err != null) {
          logger.error("[AccountRepository->login()] " + err);
        }
      }
    );

    return [token, identifier, userID];
  }

  async VerifyLoginToken(token, identifier) {
    //Get token hash by email
    const token_hash = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT `auth_token` FROM `auth_token` WHERE `identifier` = ?",
        [identifier],
        function (err, results, fields) {
          try {
            resolve(results[0]["auth_token"]);
          } catch {
            logger.error("[AccountRepository->login()] " + err);
            resolve("");
          }
        }
      );
    });

    //TODO: check date

    //check token_hash hashes
    const result_bcrypt = bcrypt.compareSync(token, token_hash);

    if (!result_bcrypt) {
      return false;
    }

    return true;
  }

  async UpdateAuthToken(identifier) {
    let token = await utils.generateToken();

    let token_hash = await utils.genHash(token);

    let currenDate = utils.getCurrentDate();

    connection.query(
      "UPDATE `auth_token` SET `auth_token`= ?,`date`= ? WHERE `identifier` = ?",
      [token_hash, currenDate, identifier],
      function (err, results, fields) {
        if (err != null) {
          logger.error("[AccountRepository->updateAuthToken()] " + err);
        }
      }
    );

    return token;
  }

  async Logout(identifier) {
    connection.query(
      "DELETE FROM `auth_token` WHERE `identifier` = ?",
      [identifier],
      function (err, results, fields) {
        if (err != null) {
          logger.error("[AccountRepository->Logout()] " + err);
        }
      }
    );
  }

  async IsUsernameAvalible(username) {
    //Get userID by username
    const userID = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT `ID` FROM `person` WHERE `Username` = ?",
        [username],
        function (err, results, fields) {
          try {
            resolve(results[0]["ID"]);
          } catch {
            logger.error("[AccountRepository->isUsernameAvalible()] " + err);
            resolve("");
          }
        }
      );
    });

    console.log(userID);

    if (userID == "") {
      return true;
    }

    return false;
  }

  async IsEmailAvalible(email) {
    //Get userID by email
    const userID = await this.GetUserIDByEmail(email);

    if (userID == "") {
      return true;
    }

    return false;
  }

  async GetUserIDByEmail(email) {
    return await new Promise((resolve, reject) => {
      connection.query(
        "SELECT `ID` FROM `person` WHERE `Email` = ?",
        [email],
        function (err, results, fields) {
          try {
            resolve(results[0]["ID"]);
          } catch {
            logger.error("[AccountRepository->GetUserIDByEmail()] " + err);
            resolve("");
          }
        }
      );
    });
  }
}

module.exports = AccountRepository;
