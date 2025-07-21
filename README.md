# Exercise Tracker

A REST API project for tracking users and their exercises, built with Node.js and Express. 
## Features

- Create new users
- Add exercises for users
- Retrieve user exercise logs with optional filters (date range, limit)

## API Endpoints

### Create a New User
```
POST /api/users
```
**Body:**  
`username` (string)

### Add Exercise
```
POST /api/users/:_id/exercises
```
**Body:**  
`description` (string, required)  
`duration` (number, required, minutes)  
`date` (string, optional, yyyy-mm-dd)

### Get User Logs
```
GET /api/users/:_id/logs?[from][&to][&limit]
```
**Query Parameters:**  
`from`, `to` (dates, yyyy-mm-dd, optional)  
`limit` (number, optional)

## Getting Started

1. Clone the repo:
   ```
   git clone https://github.com/sabbas-ctrl/Exercise-Tracker.git
   cd Exercise-Tracker
   ```
2. Install dependencies:
   ```
   npm install
   ```
3. Start the server:
   ```
   npm run dev
   ```
   The app runs on [http://localhost:3000](http://localhost:3000).

## Project Structure

- `index.js` – Main server file
- `public/` – Static assets (CSS)
- `views/` – HTML frontend# Exercise Tracker

