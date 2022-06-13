import loginService from '../services/auth'
import userService from '../services/user'
import { notify } from './notificationReducer'

const reducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN':
    return action.user
  case 'LOGOUT':
    return {}
  default: return state
  }
}

export const saveUser = user => {
  return async dispatch => {
    try {
      dispatch({ type: 'LOGIN', user })
      userService.saveUser(user)
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const login = user => {
  return async dispatch => {
    try {
      const loggedInUser = await loginService.login(user)
      dispatch(notify('Login successful'))
      dispatch(saveUser(loggedInUser))
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const logout = () => {
  return async dispatch => {
    try {
      userService.logOut()
      dispatch({ type: 'LOGOUT' })
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}


export default reducer