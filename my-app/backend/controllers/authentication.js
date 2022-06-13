const jwt = require('jsonwebtoken')
const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')
const { validatePassword } = require('../utils/validation')


router.post('/register', async (request, response) => {
  const { userName, name, password } = request.body
  validatePassword(password)

  const passwordHash = await bcrypt.hash(password, 10)
  const user = new User({ userName, name, passwordHash })
  const savedUser = await user.save()
  response.status(201).json(savedUser)
})


router.get('/users', async (request, response) => {
  const users = await User.find({}).populate('blogs')
  response.json(users)
})


router.post('/login', async (request, response) => {
  const { userName, password } = request.body
  const user = await User.findOne({ userName })

  if (!user || !await bcrypt.compare(password, user.passwordHash))
    return response.status(401).json({ error: 'Invalid user name or password' })

  const userForToken = { userName, id: user._id }
  const token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })

  response.json({ token, userName, name: user.name })
})

module.exports = router