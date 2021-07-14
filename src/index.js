require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const getNetlify = require('./getNetlify')
const fetch = require('node-fetch')

const app = express()
app.use(bodyParser.json())

const CACHE_TIME = 1000 * 5 // 5s

const { IFTTT_KEY } = process.env
const iftttWebhookUrl = `https://maker.ifttt.com/trigger/letna_dev_notification/with/key/${IFTTT_KEY}`

let cache, timestamp

const getTimestamp = () => new Date() / 1

app.get('/', async function (req, res) {
  if (cache && timestamp && timestamp + CACHE_TIME > getTimestamp()) {
    console.log('sending cached')
    res.send(cache)
  } else {
    console.log('sending live')
    const net = await getNetlify()
    cache = net
    timestamp = getTimestamp()
    res.send(net)
  }
})

app.post('/webhook', async function (req, res) {
  const response = await fetch(iftttWebhookUrl, {
    method: 'POST', 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "value1": req.body || "empty",
    })
  }).then(res => res.json())
  .catch(()=>({"message":""}))
  res.send(response)
})


app.listen(8081)
