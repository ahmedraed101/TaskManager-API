const UserModel = require('../models/user')
const { sendWellcomeEmail, sendCancelationEmail } = require('../emails/account')

const signUp = async (req, res) => {
    try {
        const user = await UserModel.create(req.body)
        sendWellcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).json({ user, token })
    } catch (err) {
        res.status(400).json(err)
    }
}

const loginUser = async (req, res) => {
    try {
        const user = await UserModel.findByCredentials(
            req.body.email,
            req.body.password
        )
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (err) {
        res.status(400).send()
    }
}

const logOut = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        )
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
}

const logOutAll = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (err) {
        res.status(500).send()
    }
}

const getMyProfile = async (req, res) => {
    res.send(req.user)
}

const getUser = async (req, res) => {
    try {
        const _id = req.params.id
        const user = await UserModel.findById(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.json(user)
    } catch (err) {
        if (err.path) {
            return res.status(400).send()
        }
        res.status(500).send(err)
    }
}

const updateUser = async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    )
    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates' })
    }
    try {
        updates.forEach((update) => (req.user[update] = req.body[update]))
        await req.user.save()
        res.json(req.user)
    } catch (err) {
        return res.status(400).send()
    }
}

const deleteUser = async (req, res) => {
    try {
        await req.user.deleteOne()
        sendCancelationEmail(req.user.name, req.user.email)
        res.json(req.user)
    } catch (err) {
        res.status(400).send()
    }
}

module.exports = {
    signUp,
    getMyProfile,
    getUser,
    updateUser,
    deleteUser,
    loginUser,
    logOut,
    logOutAll,
}
