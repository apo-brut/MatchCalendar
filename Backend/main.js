const express = require('express')
const helmet = require('helmet');
const Logger = require("./Logger.js");
var nconf = require('nconf');
const app = express()
const port = 3000

// Node logger
const logger = new Logger();

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

  //Middleware

  app.use((req, res, next) => {
    logger.writeLog(`[API_CALL] Time: ` + Date.now())
    next()
  })

  //Helmet security
  app.use(helmet())

  //API Calender

  app.post('/api/signup', (req, res) => {
    res.send('User angelegt')
  })

  app.post('/api/login', (req, res) => {
    res.send('User angemeldet')
  })

  app.post('/api/calenderevent', (req, res) => {
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