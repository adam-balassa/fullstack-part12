const validationError = message => {
  throw { name: 'ValidationError', message }
}

const validatePassword = password => {
  if (!password || password.length < 3)
    validationError('Password must be at least 3 characters long')
}

module.exports = { validatePassword }