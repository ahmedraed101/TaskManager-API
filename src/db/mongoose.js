const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api')

const main = async () => {
    await mongoose.connect(process.env.MONGO_URL)
}

main()
// const me = new UserModel({
//     name: '  Osame  ',
//     email: 'OSAMA@MSOURA.IO',
//     password: ' 2890dv8923jlk(*) ',
// })
// me.save()
//     .then((d) => {
//         console.log(d)
//     })
//     .catch((err) => {
//         console.error(err)
//     })

// const taskSchema = mongoose.Schema({
//     description: { type: String, required: true, trim: true },
//     completed: { type: Boolean, default: false },
// })

// const taskModel = mongoose.model('task', taskSchema)
// // const task = taskModel({ description: 'clean your room', completed: true })
// const task = taskModel({ description: 'clean your desk' })
// task.save()
//     .then((d) => console.log(d))
//     .catch((err) => console.error(err))
