const reducer = (state = { }, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return { message: action.message, error: action.error }
  case 'CLEAR_NOTIFICATION':
    if (action.message === state.message)
      return { }
    return state
  default: return state
  }
}

const setNotification = (message, error) => ({
  type: 'SET_NOTIFICATION',
  message, error
})

const clearNotification = message => ({
  type: 'CLEAR_NOTIFICATION',
  message
})

export const notify = (message, error=false, timeOutInSeconds=2) => {
  return async dispatch => {
    dispatch(setNotification(message, error))
    setTimeout(() => {
      dispatch(clearNotification(message))
    }, 1000 * timeOutInSeconds)
  }
}

export default reducer