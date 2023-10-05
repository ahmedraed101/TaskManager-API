const request = require('supertest')
const app = require('../src/app')
const UserModel = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup new user', async () => {
    const response = await request(app)
        .post('/api/users')
        .send({
            name: 'ahmed',
            email: 'az3556799@gmail.com',
            password: 'ahmed123',
        })
        .expect(201)

    // assert that the database changed correctly
    const user = await UserModel.findById(response.body.user._id)
    expect(user.name).not.toBeNull()

    // Assertion about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'ahmed',
            email: 'az3556799@gmail.com',
        },
        token: user.tokens[0].token,
    })

    expect(user.password).not.toBe('ahmed123')
})

test('should login', async () => {
    const response = await request(app)
        .post('/api/users/login')
        .send({ email: userOne.email, password: userOne.password })
        .expect(200)

    const user = await UserModel.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("shoudn't login with wrong creds", async () => {
    await request(app)
        .post('/api/users/login')
        .send({ email: 'wrong@email.com', password: 'wonrgpass' })
        .expect(400)
})

test('Should get profile', async () => {
    await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test("Should't get profile for unauthenticated user", async () => {
    await request(app).get('/api/users/me').send().expect(401)
})

test('should delete account', async () => {
    const response = await request(app)
        .delete('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

    const user = await UserModel.findById(userOneId)
    expect(user).toBeNull()
})

test("shouldn't delete account", async () => {
    await request(app).delete('/api/users/me').send().expect(401)
})

test('should upload avatar image', async () => {
    await request(app)
        .post('/api/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', './tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await UserModel.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('sould update valid users fields', async () => {
    const newName = 'Hossam'
    await request(app)
        .patch('/api/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: newName,
        })
        .expect(200)

    const user = await UserModel.findById(userOneId)
    expect(user.name).toBe(newName)
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/api/user/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            otherField: 'Lol that is wrong',
        })
        .expect(404)
})

//
// User Test Ideas
//
// Should not signup user with invalid name/email/password
// Should not update user if unauthenticated
// Should not update user with invalid name/email/password
// Should not delete user if unauthenticated
