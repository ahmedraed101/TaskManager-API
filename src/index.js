const express = require('express')
const mongoose = require('mongoose')
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

mongoose
    .connect(MONGO_URL)
    .then(() => {
        console.log('> DB Connected!')
        app.listen(PORT, () => {
            console.log(`> listening on port: ${PORT}`)
        })
    })
    .catch((err) => console.error(err))
