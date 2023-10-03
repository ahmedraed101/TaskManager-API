const jwt = require('jsonwebtoken')
const UserModel = require('../models/user')

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.replace('Bearer ', '')
        const decoded = jwt.verify(token, 'thisismynewcourse')
        const user = await UserModel.findOne({
            _id: decoded._id,
            'tokens.token': token,
        })

        if (!user) throw new Error()

        req.token = token
        req.user = user
        next()
    } catch (err) {
        res.status(401).send({ error: 'please authenticate.' })
    }
}

module.exports = auth
