const express = require('express')
const shell = require('shelljs')
const cron = require('node-cron')

const app = express()

shell.echo('EPG Scheduled')

cron.schedule('0 4 * * *', () => {
  shell.exec('npm run grab -- --site=tv.nu --output="./public/guide.xml" --lang=sv')
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`App started on ${port}`)
})
