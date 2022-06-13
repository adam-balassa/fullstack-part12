import React, { useEffect } from 'react'
import {
  Switch, Route, Redirect, BrowserRouter as Router
} from 'react-router-dom'
import Menu from './components/Menu'
import Login from './components/Login'
import Users from './components/Users'
import UserDetails from './components/UserDetails'
import Notification from './components/Notification'
import BlogDetails from './components/BlogDetails'
import Main from './components/Main'
import blogService from './services/blogs'
import userService from './services/user'
import { useDispatch, useSelector } from 'react-redux'
import { initBlogs } from './reducers/blogReducer'
import { saveUser } from './reducers/userReducer'
import { initUsers } from './reducers/usersReducer'


const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(({ user }) => user)

  useEffect(() => {
    const loggedInUser = userService.getUser()
    loggedInUser ? dispatch(saveUser(loggedInUser)) : dispatch(saveUser({}))
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      dispatch(initBlogs())
      dispatch(initUsers())
    }
  }, [user])

  return <Router>
    <Menu />
    <Notification/>
    { user && <Switch>
      <Route path='/login'>
        { user.userName ? <Redirect to='/'/> : <Login/> }
      </Route>
      <Route path="/">
        { user.userName ? '' : <Redirect to='/login'/> }
        <Switch>
          <Route path='/users/:id'>
            <UserDetails/>
          </Route>
          <Route path='/users'>
            <Users/>
          </Route>
          <Route path='/blogs/:id'>
            <BlogDetails/>
          </Route>
          <Route path='/' exact={true}>
            <Main/>
          </Route>
        </Switch>
      </Route>
    </Switch> }
  </Router>
}

export default App