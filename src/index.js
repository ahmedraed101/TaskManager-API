const app = require('./app')
const mongoose = require('mongoose')

const PORT = process.env.PORT
const MONGO_URL = process.env.MONGO_URL

app.listen(PORT, () => {
    console.log(`> listening on port: ${PORT}`)
})
// mongoose
//     .connect(MONGO_URL)
//     .then(() => {
//         console.log('> DB Connected!')
//     })
//     .catch((err) => console.error(err))
