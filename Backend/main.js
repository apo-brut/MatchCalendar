const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('MatchCalender API Version: 1.0.0')
})

app.get('/api/test', (req, res) => {
    res.send('Wenn du das hier zurückbekommst, dann hast du es geschaft!')
  })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})