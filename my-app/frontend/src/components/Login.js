import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { login } from '../reducers/userReducer'

const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = (userName, password) => {
    dispatch(login({ userName, password }))
    history.push('/')
  }

  return <Grid centered  verticalAlign='middle' style={{ height: '60vh' }}>
    <Grid.Column width={6}>
      <Segment padded>
        <h2>Log in</h2>
        <Form onSubmit={e => { e.preventDefault(); onLogin(userName, password) }}>
          <Form.Field>
            <Form.Input icon='user' iconPosition='left' value={userName} name="userName" placeholder='Username'
              onChange={event => setUserName(event.target.value)} />
          </Form.Field>
          <Form.Field>
            <Form.Input icon='lock' iconPosition='left' type="password" value={password} placeholder='Password'
              onChange={event => setPassword(event.target.value)} />
          </Form.Field>
          <Button type="submit" primary>Log in</Button>
        </Form>
      </Segment>
    </Grid.Column>
  </Grid>
}

export default Login