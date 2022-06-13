import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import Blogs from './Blogs'
import { Grid, Header, Icon } from 'semantic-ui-react'

const UserDetails = () => {
  const userId = useParams().id
  const user = useSelector(({ users }) => users.find(user => user.id === userId))

  return user && <Grid relaxed='very' container centered>
    <Grid.Row>
      <Header as='h1' icon textAlign='center'>
        <Icon name='user' circular />
        <Header.Content>{user.name}</Header.Content>
      </Header>
    </Grid.Row>
    <Grid.Column width={10}>
      <h2>Added blogs</h2>
      <Blogs blogs={user.blogs.map(blog => ({ ...blog, user }))} />
    </Grid.Column>
  </Grid > || <h2>User not found</h2>|| <h2></h2>
}

export default UserDetails