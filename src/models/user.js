const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const TaskModel = require('./task')

const UserSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            required: true,
            validate: (val) => {
                if (!validator.isEmail(val)) {
                    throw new Error('Invalid email')
                }
            },
        },
        age: {
            type: Number,
            default: 0,
            validate: (val) => {
                if (val < 0) {
                    throw new Error('age must be positive number')
                }
            },
        },
        password: {
            type: String,
            required: true,
            trim: true,
            minLength: [7, 'the minimum characters is 7'],
            validate: (val) => {
                if (val.toLowerCase().includes('password')) {
                    throw new Error(
                        'Password must not contain the word "password"'
                    )
                }
            },
        },
        tokens: [
            {
                token: { type: String, required: true },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    {
        timestamps: true,
    }
)

UserSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

UserSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}

UserSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user.id.toString() }, 'thisismynewcourse', {
        expiresIn: '7 days',
    })
    user.tokens.push({ token })
    // user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await UserModel.findOne({ email })

    if (!user) {
        throw new Error('Unable to Login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user
}

// hashs plain text password before saving
// shcema.post('save' | 'validate' | ...)
UserSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

// delete user tasks when user is removed
UserSchema.pre(
    'deleteOne',
    { document: true, query: false },
    async function (next) {
        const user = this
        await TaskModel.deleteMany({ owner: user._id })
        next()
    }
)

const UserModel = mongoose.model('User', UserSchema)

module.exports = UserModel
