const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('MatchCalender API Version: 1.0.0')
})

  // Testing API

  app.get('/api/test', (req, res) => {
    res.send('Wenn du das hier zurückbekommst, dann hast du es geschaft!')
  })

  //Middleware


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

  app.update('/api/calenderevent', (req, res) => {
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
  app.update('/api/settings', (req, res) => {
    res.send('Settings updated')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})