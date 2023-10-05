const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('../../src/models/user')
const TaskModel = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'ali',
    email: 'ali@gmail.com',
    password: 'aliHi123',
    tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Hossam',
    email: 'Hossam@gmail.com',
    password: 'hossamHi123',
    tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task one',
    completed: false,
    owner: userOneId,
}

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task Two',
    completed: true,
    owner: userOneId,
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Task three',
    completed: true,
    owner: userTwoId,
}

const setupDatabase = async () => {
    await UserModel.deleteMany()
    await TaskModel.deleteMany()
    await UserModel.create(userOne)
    await UserModel.create(userTwo)
    await TaskModel.create(taskOne)
    await TaskModel.create(taskTwo)
    await TaskModel.create(taskThree)
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    userTwoId,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
}
