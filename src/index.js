const express = require('express')
const getNetlify = require('./getNetlify')

const app = express()
const CACHE_TIME = 1000 * 5 // 5s

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

app.listen(8081)
