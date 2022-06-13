const jwt = require('jsonwebtoken')
const supertest = require('supertest')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => {
  await helper.emptyDB()
  await helper.initDB()
})

describe('listing users', () => {
  test('returns users when DB is not empty', async () => {
    const response = await api
      .get('/api/auth/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialUsers.length)
    helper.initialUsers.forEach(expectedUser => {
      expect(response.body).toContainEqual(expect.objectContaining({ userName: expectedUser.userName, name: expectedUser.name, id: expect.any(String) }))
      expect(response.body).not.toContainEqual(expect.objectContaining({ passwordHash: expect.any(String) }))
    })
  })

  test('populates blogs', async () => {
    const response = await api.get('/api/auth/users')

    response.body.forEach(user =>
      expect(user.blogs).toBeDefined())

    const user = response.body.find(({ userName }) => userName === helper.initialUsers[0].userName)
    helper.initialBlogs.forEach(blog =>
      expect(user.blogs).toContainEqual(expect.objectContaining(blog)))
  })
})

describe('registering a user', () => {
  const newUser = {
    userName: 'newUser',
    name: 'New User',
    password: 'superS#cr#tP@ssword123'
  }

  test('succeeds if correct user is provided', async () => {
    await api
      .post('/api/auth/register')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDB = await helper.usersInDb()
    expect(usersInDB).toHaveLength(helper.initialUsers.length + 1)
    expect(usersInDB).toContainEqual(expect.objectContaining({
      userName: 'newUser',
      name: 'New User',
      passwordHash: expect.any(String)
    }))
  })

  test('uploads user with hashed password', async () => {
    await api
      .post('/api/auth/register')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersInDB = await helper.usersInDb()
    const user = usersInDB.find(user => user.userName === 'newUser')
    expect(await bcrypt.compare('superS#cr#tP@ssword123', user.passwordHash)).toBeTruthy()
  })

  test('returns Bad Request if password is invalid', async () => {
    await api
      .post('/api/auth/register')
      .send({ ...newUser, password: 'ab' })
      .expect(400)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
  })

  test('returns Bad Request if user name is not unique', async () => {
    await api
      .post('/api/auth/register')
      .send({ ...newUser, userName: helper.initialUsers[0].userName })
      .expect(400)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
  })

  test('returns Bad Request if user name is not given', async () => {
    await api
      .post('/api/auth/register')
      .send({ ...newUser, userName: undefined })
      .expect(400)

    expect(await helper.usersInDb()).toHaveLength(helper.initialUsers.length)
  })
})

describe('login', () => {
  test('with correct credential succeeds', async () => {
    const { userName, name, password } = helper.initialUsers[0]
    const { body } = await api
      .post('/api/auth/login')
      .send({ userName, password })
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(body).toMatchObject({
      token: expect.any(String),
      userName, name
    })
    expect(jwt.verify(body.token, process.env.SECRET)).toMatchObject({ userName })
  })

  test('returns Unauthorized on wrong password', async () => {
    const { userName } = helper.initialUsers[0]
    const { body } = await api
      .post('/api/auth/login')
      .send({ userName, password: 'IncOrrectP@ssword' })
      .expect(401)

    expect(body).toMatchObject({ error: 'Invalid user name or password' })
  })

  test('returns Unauthorized on wrong username', async () => {
    const { body } = await api
      .post('/api/auth/login')
      .send({ userName: 'IncorrectUserName', password: 'IncOrrectP@ssword' })
      .expect(401)

    expect(body).toMatchObject({ error: 'Invalid user name or password' })
  })
})

afterAll(async () => {
  await helper.emptyDB()
  mongoose.connection.close()
})