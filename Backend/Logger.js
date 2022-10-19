const fs = require('fs')
var os = require("os");

class Logger {

  //Log a msg to logfile
  log(msg) {
    let date = this.getDate();
    this.writeLog("[" + date + "] " + msg)
  }

  //Log a warning to logfile
  warn(msg) {
    let date = this.getDate();
    this.writeErrorLog("{NOTICE} [" + date + "] " + msg)
  }

  //Log a error to logfile
  error(msg) {
    let date = this.getDate();
    this.writeErrorLog("{ERROR} [" + date + "] " + msg)
  }

  //Log a msg to customtype logfile
  customLogType(msg, log_name, date) {
    if (date == true) {
      let date = this.getDate();
      this.writeCustomLog("[" + date + "] " + msg, log_name)
    } else {
      this.writeCustomLog(msg, log_name);
    }
  }

  //write logfile
  writeLog(content) {
    console.log(content);
    fs.appendFile('./logs/Log_' + this.getFileName() + '.txt', "\n" + content, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  }

  //write error logfile
  writeErrorLog(content) {
    console.log(content);
    fs.appendFile('./logs/ERROR_' + this.getFileName() + '.txt', "\n" + content, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  }

  //write custom logfile
  writeCustomLog(content, log_name) {
    console.log(content);
    fs.appendFile('./logs/' + log_name + "_" + this.getFileName() + '.txt', "\n" + content, err => {
      if (err) {
        console.error(err)
        return
      }
      //file written successfully
    })
  }

  getFileName() {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    let insertDate =
      year +
      "-" +
      month +
      "-" +
      date;
    return insertDate;
  }

  getDate() {
    let date_ob = new Date();

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
    let insertDate =
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
      seconds;
    return insertDate;
  }

}
module.exports = Logger;