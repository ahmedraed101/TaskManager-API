const TaskModel = require('../models/task')

const addTask = async (req, res) => {
    try {
        const task = await TaskModel.create({
            ...req.body,
            owner: req.user._id,
        })
        res.status(201).json(task)
    } catch (err) {
        res.status(400).json(err)
    }
}
// GEt api/tasks?completed=true
// GET api/tasks?limit=10&skip=20 // third page
// GET api/tasks?sortBy=createdAt:desc // asc
const listTasks = async (req, res) => {
    const match = {}
    const sort = {}

    if (req.query.completed) match.completed = req.query.completed === 'true'
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await TaskModel.find({ owner: req.user._id }) // works the same
        // await req.user.populate('tasks')
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit, 10),
                skip: parseInt(req.query.skip, 10),
                sort,
            },
        })
        res.json(req.user.tasks)
    } catch (err) {
        res.status(500).send()
    }
}

const getTask = async (req, res) => {
    const _id = req.params.id
    try {
        const task = await TaskModel.findOne({ _id, owner: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.json(task)
    } catch (err) {
        if (err.path) return res.status(400).send()
        res.status(500).send()
    }
}

const updateTask = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['completed', 'description']
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates' })
    }
    try {
        const task = await TaskModel.findOne({
            _id: req.params.id,
            owner: req.user._id,
        })

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => (task[update] = req.body[update]))
        await task.save()
        res.send(task)
    } catch (err) {
        res.status(400).send()
    }
}

const deleteTask = async (req, res) => {
    try {
        const task = await TaskModel.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (err) {
        res.status(400).send()
    }
}

module.exports = {
    addTask,
    listTasks,
    getTask,
    updateTask,
    deleteTask,
}
