const express = require('express')
const { spawn } = require('child_process')
const cron = require('node-cron')

const app = express()

console.log('EPG Scheduled')

cron.schedule('0 4 * * *', () => {
  spawn('npm run grab --- --sites=allente.se --output="./public/guide.xml" --lang=se', {
    shell: true,
    stdio: 'inherit'
  })
})

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index')
})

const port = process.env.PORT || 3000
app.listen(port, function () {
  console.log(`App started on ${port}`)
})
