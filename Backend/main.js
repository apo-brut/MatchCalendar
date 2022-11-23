const express = require("express");
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");
const Logger = require("./Logger.js");
var nconf = require("nconf");
var cors = require("cors");
const Utils = require("./utils.js");
const app = express();
const moment = require("moment");
let port = 3000;

// Node logger
const logger = new Logger();

// Node Utils
const utils = new Utils();

//Repositories
const CalendarEventRepository = require("./Reposities/CalendarEventRepository.js");
const calenderevent = new CalendarEventRepository();
const AccountRepository = require("./Reposities/AccountRepository.js");
const account = new AccountRepository();
const CalendarPersonRepository = require("./Reposities/CalendarPersonRepository.js");
const person = new CalendarPersonRepository();

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
  file: "config.json",
});

//Get port from config
port = nconf.get("matchCalender:port")


//Helmet security
app.use(helmet());

app.use(express.static("public"));

app.use(express.json());

//Regex for pw and mail validation
const passwordRequirements =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,60}$/;
const emailRequirements =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

//Cors
app.use(cors());

// Add headers before the routes are defined
app.use((req, res, next) => {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Pass to next layer of middleware
  next();
});


app.all("/app/*", function (req, res, next) {
  // Just send the index.html for other files to support HTML5Mode
  res.sendFile("./public/app/index.html", {
    root: __dirname,
  });
});

let newToken = "";

/**
 * API
 */

//Middleware

app.use((req, res, next) => {
  logger.writeLog(`[API_CALL] Time: ` + Date.now() + " " + req.originalUrl);
  next();
});

app.get("/", (req, res) => {
  res.json({
    author: nconf.get("matchCalender:author"),
    version: nconf.get("matchCalender:version"),
    documentation: nconf.get("matchCalender:documentation"),
    enviroment: nconf.get("matchCalender:enviroment"),
    "openapi-version": "3.0.0",
    title: "matchCalender API",
    description: "This is a API for matchCalender",
  });
});

// Testing API

app.get("/api/test", (req, res) => {
  res.send("Wenn du das hier zurückbekommst, dann hast du es geschaft!");
});

//API Calender

/*
 * Login API
 */
app.get("/api/login", async (req, res) => {
  if (
    req.query.email == null ||
    req.query.password == null
  ) {
    res.send({
      status: "false",
      response: "some fielddata null",
    });
    return false;
  }

  let email = utils.XSS(req.query.email);

  //check if account already exsist
  let [token, identifier, userID] = await account.Login(email, req.query.password);

  if (token == "") {
    res.send({
      status: "false",
      response: "email or password is wrong",
    });
    return false;
  }

  res.send({
    status: "true",
    response: "successfull loged in",
    token: token,
    userID: userID,
    identifier: identifier,
  });
});

/*
 * Signup API
 */
app.post("/api/signup", async (req, res) => {
  if (
    req.query.email == null ||
    req.query.password == null ||
    req.query.username == null
  ) {
    res.send({
      status: "false",
      response: "some fielddata null",
    });
    return false;
  }

  if (req.query.email.length > 255 || req.query.username.length > 255) {
    res.send({
      status: "false",
      response: "some fielddata to long",
    });
    return false;
  }

  let email = utils.XSS(req.query.email);
  let password = utils.XSS(req.query.password);
  let username = utils.XSS(req.query.username);

  //check username
  let isUsernameAvalible = await account.IsUsernameAvalible(username);

  if (!isUsernameAvalible) {
    res.send({
      status: "false",
      response: "Username is already taken",
    });
    return false;
  }

  //check email
  if (!req.query.email.match(emailRequirements)) {
    res.send({
      status: "false",
      response: "E-mail is not valid",
    });
    return false;
  }

  //check if account already exsist
  let isEmailAvalible = await account.IsEmailAvalible(email);

  if (!isEmailAvalible) {
    res.send({
      status: "false",
      response: "E-mail is already taken",
    });
    return false;
  }

  //check password
  if (!req.query.password.match(passwordRequirements)) {
    res.send({
      status: "false",
      response: "Password is to weak",
    });
    return false;
  }

  account.Signup(username, email, password);

  res.send({ status: "true", response: "Account is created" });
});

//API Matching

app.get("/api/userSearch", async (req, res) => {
  let username = req.query.username;
  // get userID by username
  let userID = await person.getUserIdByUserName(username);
  res.send(userID);
});

/*
 *
 * API Auth Middleware
 *
 */

app.use("/api/:token/:identifier/*", async (req, res, next) => {
  if (!res.headersSent) {

    let token = utils.XSS(req.params.token);
    let identifier = utils.XSS(req.params.identifier);

    const isAuthTokenValid = await account.VerifyLoginToken(token,identifier);

    if (!isAuthTokenValid) {
      res.send({ status: "false", response: "invalid API Token" });
      return false;
    }

    newToken = await account.UpdateAuthToken(identifier);


    next();
  }
});

app.get("/api/:token/:identifier/test", async (req, res) => {


  res.send({newToken: newToken});
});

app.post("/api/:token/:identifier/calenderevent", (req, res) => {
  if (req.body == null) {
    res.send("Error Body invalid");
    return false;
  }

  let body = req.body;

  Object.keys(body).forEach((key) => {
    let userID = 0;
    let color = "blue";
    let date = "blue";
    let description = "oh boy Jolli\n";
    let end = "16:00";
    let start = "13:00";
    let title = "Title";
    let matchID = "";

    let uuid = "";

    userID = key;

    Object.keys(body[key]["events"]).forEach((dateKey) => {
      uuid = "rfregreg";
      Object.keys(body[key]["events"][dateKey]).forEach((eventID) => {
        let event = body[key]["events"][dateKey][eventID];

        color = event["color"];
        date = event["date"];
        description = event["description"];
        end = date + " " + event["end"] + ":00";
        start = date + " " + event["start"] + ":00";
        title = event["title"];

        if(matchID.length > 0){
          //Add event with matchID
          calenderevent.AddCalenderEvent(
            userID,
            start,
            end,
            title,
            description,
            color,
            date,
            uuid
          );
        }else{
        //Add event without matchID
        calenderevent.AddCalenderEvent(
          userID,
          start,
          end,
          title,
          description,
          color,
          date,
          ""
        );
        }
      });
    });
  });

  res.send({newToken: newToken,response: "Event created"});
});

app.get("/api/:token/:identifier/calenderevent", async (req, res) => {
  let userid = req.query.userid;

  // get username by userID
  let usernameByID = await person.getUsernameByUserId(userid);

  const calenderEvents = await calenderevent.GetCalendarEvents(userid);

  let response = {
    newToken: newToken
  };

  await calenderEvents.forEach((event) => {

    let date = moment(Date.parse(event["Date"])).format('YYYY-MM-DD');

    if(! response.hasOwnProperty(userid)){
      response[userid] = {};
    }
    
    if(! response[userid].hasOwnProperty('events')){
      response[userid]["username"] = usernameByID;
      response[userid]["events"] = {};
    }

    if(! response[userid]["events"].hasOwnProperty(date)){
      response[userid]["events"][date] = {};
    }

    let Start = moment(Date.parse(event["Start"])).format();
    let End = moment(Date.parse(event["End"])).format();

    response[userid]["events"][date][event["ID"]] = {
      color: event["Color"],
      date: date,
      description: event["Description"],
      end: End,
      id: event["ID"],
      start: Start,
      title: event["Title"],
    };
  });

  res.send(response);
});

app.put("/api/:token/:identifier/calenderevent", async (req, res) => {
  await calenderevent.UpdateCalenderEvent();
  if (req.body == null) {
    res.send("Error Body invalid");
    return false;
  }

  let body = req.body;

  Object.keys(body).forEach((key) => {
    let userID = 0;
    let color = "blue";
    let date = "blue";
    let description = "oh boy Jolli\n";
    let end = "16:00";
    let start = "13:00";
    let title = "Title";
    let matchID = "";

    let uuid = "";

    userID = key;

    Object.keys(body[key]["events"]).forEach((dateKey) => {
      uuid = "rfregreg";
      Object.keys(body[key]["events"][dateKey]).forEach((eventID) => {
        let event = body[key]["events"][dateKey][eventID];

        color = event["color"];
        date = event["date"];
        description = event["description"];
        end = date + " " + event["end"] + ":00";
        start = date + " " + event["start"] + ":00";
        title = event["title"];

        if(matchID.length > 0){
          //updatr event with matchID
          calenderevent.UpdateCalenderEvent(
            start,
            end,
            title,
            description,
            color,
            date
          );
        }else{
        //update event without matchID
        calenderevent.UpdateCalenderEvent(
          start,
          end,
          title,
          description,
          color,
          date
        );
        }
      });
    });
  });

  res.send({newToken: newToken,response: "Event updated"});
});

app.delete("/api/:token/:identifier/calenderevent", async (req, res) => {
  let eventID = req.query.eventID;

  if(eventID == undefined || eventID == ""){
    res.send({newToken: newToken,response: "Error"});
    return false;
  }

  await calenderevent.DeleteCalenderEvent(eventID);
  res.send({newToken: newToken,response: "Event deleted"});
});

/**
 * Server create
 */

https
  .createServer(
    {
      key: fs.readFileSync("./ssl/key.pem"),
      cert: fs.readFileSync("./ssl/cert.pem"),
      passphrase: "d§$Fsdftr34rwefefdegfdwf",
    },
    app
  )
  .listen(port);

logger.log(`API server running at port: ${port}/`);
