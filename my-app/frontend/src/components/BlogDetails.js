import React from 'react'
import { useSelector } from 'react-redux'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import BlogComments from './BlogComments'
import { likeBlog, deleteBlog } from '../reducers/blogReducer'
import { Button, Grid, Card, Icon, Header } from 'semantic-ui-react'

const BlogDetails = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const blogId = useParams().id
  const blog = useSelector(({ blogs }) => blogs.find(blog => blog.id === blogId))
  const user = useSelector(({ user }) => user )

  const onLike = () => {
    dispatch(likeBlog(blog))
  }

  const onDelete = blog => {
    const confirmed = window.confirm(`Are you sure you want to delete ${blog.title}?`)
    if (confirmed) {
      dispatch(deleteBlog(blog))
      history.push('/')
    }
  }

  return blog && <Grid relaxed='very' container centered>
    <Grid.Row>
      <Header as='h1' icon textAlign='center'>
        <Icon name='write' circular />
        <Header.Content>{blog.title}</Header.Content>
      </Header>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={7}>
        <Card fluid>
          <Card.Content>
            <Card.Header>{blog.title}</Card.Header>
            <Card.Meta>added by {blog.author}</Card.Meta>
            <Card.Description>
              <p><a href={blog.url}>{blog.url}</a></p>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <span style={{ marginRight: '1rem' }}>{blog.likes} likes</span>
            <Button positive color='green' onClick={onLike}>
              <Icon name='thumbs up' /> Like
            </Button>
            { blog.user && user.userName === blog.user.userName && <Button onClick={() => onDelete(blog)} color='red' floated='right' >
              <Icon name='trash' /> Delete
            </Button>}
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid.Row>
    <Grid.Column width={10}>
      <BlogComments blog={blog} />
    </Grid.Column>
  </Grid > || <h2>Blog not found</h2>
}

export default BlogDetails