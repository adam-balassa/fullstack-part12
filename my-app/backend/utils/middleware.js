const jwt = require('jsonwebtoken')
const User = require('../models/user')

const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(error.message)
  }

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
  else if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })
  else if (error.name === 'NotFoundError')
    return response.status(404).end()
  else if (error.name === 'TokenExpiredError')
    return response.status(401).json({ error: 'Expired token' })


  next(error)
}

const tokenExtractor = (request, _, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer '))
    request.token = authorization.substring(7)
  next()
}

const userExtractor = async (request, _, next) => {
  const token = request.token
  if (token) {
    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) return next()

    request.user = await User.findById(decodedToken.id)
  }
  next()
}

const authenticated = async (request, response, next) => {
  if (!request.token || !request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  next()
}

module.exports = { errorHandler, tokenExtractor, userExtractor, authenticated }