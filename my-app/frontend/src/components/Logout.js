import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../reducers/userReducer'

const Logout = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)

  const onLogout = async () => {
    dispatch(logout())
  }

  return <div>
    { user.name } is logged in
    <button onClick={onLogout}>
      Log out
    </button>
  </div>
}

export default Logout