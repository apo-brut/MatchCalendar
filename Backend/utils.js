const Logger = require("./Logger.js");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

// mb Node logger
const logger = new Logger();

class Utils {
  /**
   * XSS Protection
   */

  XSS(input) {
    if (input.includes("<")) {
      input = input.split("<");
    }
    if (input.includes(">")) {
      input = input.split(">");
    }
    return input;
  }

  getCurrentDate() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  }

  async genHash(input) {
    //gen ps hash
    const saltRounds = 10;

    //generate pw hash
    const hash = await new Promise((resolve, reject) => {
      bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(input, salt, function (err, hash) {
          resolve(hash);
        });
      });
    });

    return hash;
  }

  /*
   * Generate auth/Login Tokens
   */

  async generateToken() {
    return await new Promise((resolve, reject) => {
      crypto.randomBytes(127, function (err, buffer) {
        let token = buffer.toString("hex");
        resolve(token);
      });
    });
  }
}

module.exports = Utils;
