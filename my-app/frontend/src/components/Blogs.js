import React from 'react'
import { Container, List } from 'semantic-ui-react'
import { useHistory } from 'react-router'


const Blogs = ({ blogs }) => {
  const history = useHistory()

  return <Container>
    <List selection relaxed='very'size='large'>
      {blogs.map(blog =>
        <List.Item key={blog.id} onClick={() => history.push(`/blogs/${blog.id}`)}>
          <List.Icon name='write square' size='big' verticalAlign='middle' />
          <List.Content>
            <List.Header>
              { blog.title }
            </List.Header>
            <List.Description>
              { blog.user && blog.user.name || 'Anonymous user' }
            </List.Description>
          </List.Content>
        </List.Item>
      )}
    </List>
  </Container>
}

export default Blogs