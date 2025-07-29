const { ObjectId } = require('bson');
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config() // Ensure your .env file exists with PORT

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});
app.use(bodyParser.urlencoded({extended: false})) // For parsing form data

const arrayOfUsers = [] // Your in-memory user storage

// POST /api/users/ - Create a new user
app.post("/api/users/", (req, res) => {
  const b = req.body
  const user = {
    username: "",
    _id: new ObjectId().toHexString(),
    logs: [] // Initialize logs array here!
  }
  user.username = b.username
  arrayOfUsers.push(user)
  res.json({
    username: user.username,
    _id: user._id
  })
})

// GET /api/users - Get all users
app.get("/api/users", (req, res) => {
  res.send(arrayOfUsers.map(user => {
    return {
        username: user.username,
        _id: user._id
    };
  }))
})

// POST /api/users/:_id/exercises
app.post("/api/users/:_id/exercises", (req, res) => {
  const id = req.params._id
  const d = req.body

  // 1. Basic validation for description and duration
  if (!d.description) {
      return res.status(400).json({ error: "Description is required." });
  }
  const parsedDuration = parseInt(d.duration);
  if (!d.duration || isNaN(parsedDuration) || parsedDuration <= 0) {
      return res.status(400).json({ error: "Duration is required and must be a positive number." });
  }

  // 2. Find the user
  const u = arrayOfUsers.find(user => user._id === id);
  if (!u) {
      return res.status(404).json({ error: "User not found." });
  }

  // 3. Process and format the date for storing
  let exerciseDateObj;
  if (d.date && d.date !== "") {
    const tempDate = new Date(d.date);
    // If the date string was invalid, fallback to current date
    exerciseDateObj = isNaN(tempDate.getTime()) ? new Date() : tempDate;
  } else {
    // If date is not provided or is an empty string, use current date
    exerciseDateObj = new Date();
  }

  const formattedDate = exerciseDateObj.toDateString();

  // Add the new exercise to the user's 'logs' array
  u.logs.push({
    description: d.description,
    duration: parsedDuration,
    date: formattedDate
  });

  console.log("Updated arrayOfUsers after adding exercise:", arrayOfUsers);

  // Send the JSON response
  res.json({
    username: u.username,
    _id: u._id,
    description: d.description,
    duration: parsedDuration,
    date: formattedDate
  });
})

// --- MODIFIED GET /api/users/:_id/logs for invalid date query params ---
app.get("/api/users/:_id/logs", (req, res) => {
    const userId = req.params._id;
    const { from, to, limit } = req.query;

    const user = arrayOfUsers.find(u => u._id === userId);

    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }

    let filteredLogs = [...user.logs];

    // --- CRITICAL CHANGE FOR 'from' DATE ---
    let fromDate;
    if (from) {
        const tempFromDate = new Date(from);
        // If 'from' date is invalid, default to epoch (or current date if you prefer)
        // For consistency with POST, using new Date() here for current time is reasonable.
        fromDate = isNaN(tempFromDate.getTime()) ? new Date(0) : tempFromDate;
    } else {
        fromDate = new Date(0); // Default 'from' to epoch if not provided
    }

    // --- CRITICAL CHANGE FOR 'to' DATE ---
    let toDate;
    if (to) {
        const tempToDate = new Date(to);
        // If 'to' date is invalid, default to current date
        toDate = isNaN(tempToDate.getTime()) ? new Date(Date.now()) : tempToDate;
        // Adjust 'to' date to include the entire day only if it was a valid date initially
        if (!isNaN(tempToDate.getTime())) { // Only adjust if valid date was parsed
            toDate.setHours(23, 59, 59, 999);
        }
    } else {
        toDate = new Date(Date.now()); // Default 'to' to current date if not provided
        toDate.setHours(23, 59, 59, 999); // Ensure end of day for default 'to'
    }

    // Now apply filters using the potentially defaulted dates
    filteredLogs = filteredLogs.filter(ex => {
        const exerciseDate = new Date(ex.date).getTime();
        return exerciseDate >= fromDate.getTime() && exerciseDate <= toDate.getTime();
    });

    // Apply 'limit' filter
    if (limit) {
        const parsedLimit = parseInt(limit);
        if (!isNaN(parsedLimit) && parsedLimit > 0) { // Only apply if valid positive limit
            filteredLogs = filteredLogs.slice(0, parsedLimit);
        }
    }

    res.json({
        username: user.username,
        _id: user._id,
        count: filteredLogs.length,
        log: filteredLogs
    });
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})