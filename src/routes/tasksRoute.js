const { Router } = require('express')
const {
    addTask,
    listTasks,
    getTask,
    updateTask,
    deleteTask,
} = require('../controllers/tasksController')

const auth = require('../middleware/auth')

const router = Router()
router.post('/', auth, addTask)
router.get('/', auth, listTasks)
router.get('/:id', auth, getTask)
router.patch('/:id', auth, updateTask)
router.delete('/:id', auth, deleteTask)

module.exports = router
