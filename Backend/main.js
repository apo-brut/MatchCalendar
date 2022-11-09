const express = require("express");
const helmet = require("helmet");
const https = require("https");
const fs = require("fs");
const Logger = require("./Logger.js");
var nconf = require("nconf");
var cors = require("cors");
const app = express();
const port = 3000;

// Node logger
const logger = new Logger();

//Repositories
const CalendarEventRepository = require("./Reposities/CalendarEventRepository.js");
const calenderevent = new CalendarEventRepository();

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

app.post("/api/signup", (req, res) => {
  res.send("User angelegt");
});

app.post("/api/login", (req, res) => {
  res.send("User angemeldet");
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
    response[userid] = {
      username: username,
      events: {},
    };

    response[userid].events[date] = {};

    response[userid].events[date][id] = {
      color: event["Color"],
      date: event["Date"],
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