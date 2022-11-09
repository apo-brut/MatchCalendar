const express = require("express");
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");
const Logger = require("./Logger.js");
var nconf = require("nconf");
var cors = require("cors");
const Utils = require("./utils.js");
const app = express();
const port = 3000;

// Node logger
const logger = new Logger();

// Node Utils
const utils = new Utils();

//Repositories
const CalendarEventRepository = require("./Reposities/CalendarEventRepository.js");
const calenderevent = new CalendarEventRepository();
const AccountRepository = require("./Reposities/AccountRepository.js");
const account = new AccountRepository();

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
  file: "config.json",
});

//Helmet security
app.use(helmet());

app.use(express.static("public"));

app.use(express.json());

//Regex for pw and mail validation
const passwordRequirements =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,800000}$/;
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
  logger.writeLog(`[API_CALL] Time: ` + Date.now());
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
  let [token, identifier] = await account.Login(email, req.query.password);

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

app.post("/api/calenderevent", (req, res) => {
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
    let id = "0";
    let start = "13:00";
    let title = "Title";

    userID = key;

    Object.keys(body[key]["events"]).forEach((dateKey) => {
      Object.keys(body[key]["events"][dateKey]).forEach((eventID) => {
        let event = body[key]["events"][dateKey][eventID];

        color = event["color"];
        date = event["date"];
        description = event["description"];
        end = date + " " + event["end"] + ":00";
        id = event["id"];
        start = date + " " + event["start"] + ":00";
        title = event["title"];

        //Add event
        calenderevent.AddCalenderEvent(
          userID,
          start,
          end,
          title,
          description,
          color,
          date
        );
      });
    });
  });

  res.send("Event created");
});

app.get("/api/calenderevent", async (req, res) => {
  let userid = req.query.userid;

  let username = "Wladislaw Kusnezow";

  const calenderEvents = await calenderevent.GetCalendarEvents(userid);

  let response = {};

  calenderEvents.forEach((event) => {

    function join(t, a, s) {
      function format(m) {
         let f = new Intl.DateTimeFormat('en', m);
         return f.format(t);
      }
      return a.map(format).join(s);
   }
   
   let a = [{year: 'numeric'}, {month: 'numeric'}, {day: 'numeric'}];
   let date = join(Date.parse(event["Date"]), a, '-');

    if(! response.hasOwnProperty(userid)){
      response[userid] = {
        username: username
      };
    }
    
    if(! response[userid].hasOwnProperty('events')){
      response[userid]["events"] = {};
    }

    if(! response[userid]["events"].hasOwnProperty(date)){
      response[userid]["events"][date] = {};
    }


    response[userid]["events"][date][event["ID"]] = {
      color: event["Color"],
      date: date,
      description: event["Description"],
      end: event["End"],
      id: event["ID"],
      start: event["Start"],
      title: event["Title"],
    };
  });

  res.send(response);
});

app.put("/api/calenderevent", (req, res) => {
  res.send("Event updated");
});

app.delete("/api/calenderevent", async (req, res) => {
  let userid = req.query.eventID;
  const calenderEvents = await calenderevent.DeleteCalenderEvent(eventID);
  res.send("Event deleted");
});

//API Matching

app.get("/api/userSearch", (req, res) => {
  res.send("user123");
});

app.post("/api/match", (req, res) => {
  res.send("User added");
});

//Settings API
app.put("/api/settings", (req, res) => {
  res.send("Settings updated");
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
