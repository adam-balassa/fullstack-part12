const USER_KEY = 'blogAppUser'

const saveUser = user => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(user))
}

const getUser = () => {
  const user = window.localStorage.getItem(USER_KEY)
  return user ? JSON.parse(user) : null
}

const logOut  = () => {
  window.localStorage.removeItem(USER_KEY)
}

export default { saveUser, getUser, logOut }