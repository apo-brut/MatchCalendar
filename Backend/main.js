const express = require('express')
const helmet = require('helmet');
const Logger = require("./Logger.js");
var nconf = require('nconf');
const app = express()
const port = 3000

// Node logger
const logger = new Logger();

//Repositories
const CalendarEventRepository = require("./Reposities/CalendarEventRepository.js");
const calenderevent = new CalendarEventRepository();

// First consider commandline arguments and environment variables, respectively.
nconf.argv().env();

// Then load configuration from a designated file.
nconf.file({
  file: 'config.json'
});

  //Helmet security
  app.use(helmet())

  app.use(express.static('public'))


  app.all('/app/*', function (req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendFile('./public/index.html', {
      root: __dirname
    });
  });

  /**
   * API
   */

  
  //Middleware

  app.use((req, res, next) => {
    logger.writeLog(`[API_CALL] Time: ` + Date.now())
    next()
  })

app.get('/', (req, res) => {
  res.json({
    "author": nconf.get('matchCalender:author'),
    "version": nconf.get('matchCalender:version'),
    "documentation": nconf.get('matchCalender:documentation'),
    "enviroment": nconf.get('matchCalender:enviroment'),
    "openapi-version": "3.0.0",
    "title": "matchCalender API",
    "description": "This is a API for matchCalender",
  });
})

  // Testing API

  app.get('/api/test', (req, res) => {
    res.send('Wenn du das hier zurückbekommst, dann hast du es geschaft!')
  })

  //API Calender

  app.post('/api/signup', (req, res) => {
    res.send('User angelegt')
  })

  app.post('/api/login', (req, res) => {
    res.send('User angemeldet')
  })

  app.post('/api/calenderevent', (req, res) => {

    if( req.query.userid == null ||  req.query.start == null ||  req.query.end == null ||  req.query.title == null ||  req.query.describtion == null ||  req.query.color == null){
      res.send('Some required data not included')
      return false;
    }

    let userid = req.query.userid;
    let start = req.query.start;
    let end = req.query.end;
    let title = req.query.title;
    let describtion = req.query.describtion;
    let color = req.query.color;

    calenderevent.AddCalenderEvent();

    res.send('Event created')
  })

  app.get('/api/calenderevent', (req, res) => {
    res.send('Events to work with')
  })

  app.put('/api/calenderevent', (req, res) => {
    res.send('Event updated')
  })

  app.delete('/api/calenderevent', (req, res) => {
    res.send('Event deleted')
  })

  //API Matching

  app.get('/api/userSearch', (req, res) => {
    res.send('user123')
  })

  app.post('/api/match', (req, res) => {
    res.send('User added')
  })

  //Settings API
  app.put('/api/settings', (req, res) => {
    res.send('Settings updated')
  })

app.listen(port, () => {
  logger.writeLog(`[SYSTEM] listening on port ${port}`)
})