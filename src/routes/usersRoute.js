const { Router } = require('express')
const {
    signUp,
    getMyProfile,
    updateUser,
    deleteUser,
    loginUser,
    logOut,
    logOutAll,
} = require('../controllers/usersControllers')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = Router()

router.post('/', signUp)
router.post('/login', loginUser)
router.post('/logout', auth, logOut)
router.post('/logoutAll', auth, logOutAll)
router.get('/me', auth, getMyProfile)
router.patch('/me', auth, updateUser)
router.delete('/me', auth, deleteUser)

const upload = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload image file'))
        }
        cb(undefined, true)
    },
})

router.post(
    '/me/avatar',
    auth,
    upload.single('avatar'),
    async (req, res) => {
        buffer = await sharp(req.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer()
        req.user.avatar = buffer
        await req.user.save()
        res.send()
    },
    (error, req, res, next) => {
        res.status(400).send({ error: error.message })
    }
)

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

router.get('/me/avatar/', auth, async (req, res) => {
    try {
        if (!req.user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/png')
        res.send(req.user.avatar)
    } catch (error) {
        res.status(404).send()
    }
})

module.exports = router
