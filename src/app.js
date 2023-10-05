const express = require('express')
// const mongoose = require('mongoose')
require('./../src/db/mongoose')
const cors = require('cors')

const usersRoute = require('./routes/usersRoute')
const tasksRoute = require('./routes/tasksRoute')

const app = express()
const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

app.use(cors())
app.use(express.json())
app.use('/api/users', usersRoute)
app.use('/api/tasks', tasksRoute)

module.exports = app
