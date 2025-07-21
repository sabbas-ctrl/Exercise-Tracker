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

app.post("/api/users/", (req, res) => {
  const newId = new ObjectId();
  const b = req.body
  res.json({
    username: b.username,
    _id: newId.toHexString()
  })
})



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
