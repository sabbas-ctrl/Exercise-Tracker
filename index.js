const { ObjectId } = require('bson');
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({extended: false}))

const arrayOfUsers = []

app.post("/api/users/", (req, res) => {
  const b = req.body
  const user = {
  username: "",
  _id: new ObjectId().toHexString(),
  logs: []
}
  user.username = b.username
  arrayOfUsers.push(user)
  res.json({
    username: user.username,
    _id: user._id
})
})
app.get("/api/users", (req, res) => {
  res.send(arrayOfUsers.map(user => {
    return {
        username: user.username,
        _id: user._id
    };
}))
})

app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id
  const d = req.body
  const u = arrayOfUsers.find(user => user._id === id)
  u.logs.push({
    description: d.description,
    duration: parseInt(d.duration),
    date: d.date
  })

console.log(arrayOfUsers)

  res.json({
    username: u.username,
    _id: u._id,
    description: d.description,
    date: d.date,
    duration: parseInt(d.duration)
  })
})

app.get("/api/users/:_id/logs?", (req, res) => {
  const id = req.params._id
  const u = arrayOfUsers.find(user => user._id === id)
  res.json({
    username: u.username,
    _id: u._id,
    count: arrayOfUsers.length,
    logs: u.logs
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
