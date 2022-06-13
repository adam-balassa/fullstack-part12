import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Menu, Icon } from 'semantic-ui-react'
import { useLocation, useHistory } from 'react-router-dom'
import { logout } from '../reducers/userReducer'

const NavBar = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)
  const route = useLocation().pathname
  const history = useHistory()
  const navigateTo = link => (() => history.push(link))

  const onLogout = async () => {
    dispatch(logout())
  }

  return <Menu size='large'>
    <Menu.Item
      name='browse'
      onClick={navigateTo('/users')}
      active={route.startsWith('/users')}>
      Users
    </Menu.Item>
    <Menu.Item
      name='submit'
      onClick={navigateTo('/')}
      active={route === '/' || route.startsWith('/blogs')}
    >
      Blogs
    </Menu.Item>

    <Menu.Menu position='right'>
      {user && user.userName ? <>
        <Menu.Item
          name='user'
          active={route === 'login'}>
          <Icon name='user circle' />{ user.name }
        </Menu.Item>
        <Menu.Item
          name='logout'
          onClick={onLogout}
          active={route === 'login'}>
          { user ? 'Logout' : 'Login'}
        </Menu.Item>
      </> : <>
        <Menu.Item
          name='login'
          onClick={!user ? navigateTo('/login') : onLogout}
          active={route === 'login'}>
          Login
        </Menu.Item>
      </> }
    </Menu.Menu>
  </Menu>
}

export default NavBar