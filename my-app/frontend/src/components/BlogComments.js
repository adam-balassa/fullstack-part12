import React from 'react'
import { useDispatch } from 'react-redux'
import { addComment } from '../reducers/blogReducer'
import { useField } from '../hooks'
import { Button, Form, List, Grid } from 'semantic-ui-react'

const BlogComments = ({ blog }) => {
  const dispatch = useDispatch()
  const { reset, ...comment } = useField('text')

  const onComment = () => {
    dispatch(addComment(comment.value, blog))
    reset()
  }

  return (<>
    <h2>Comments:</h2>
    {!blog.comments.length && <span>No comments yet</span>}
    <h3>Add a comment</h3>
    <Form onSubmit={e => { e.preventDefault(); onComment() }}>
      <Grid columns='equal'>
        <Grid.Column>
          <Form.Input {...comment} placeholder='Comment...' />
        </Grid.Column>
        <Grid.Column width={3}>
          <Button type='submit'>Comment</Button>
        </Grid.Column>
      </Grid>
    </Form>
    <List relaxed size='large'>
      {blog.comments.map(comment =>
        <List.Item key={comment}>
          <List.Icon name='user circle' size='big' verticalAlign='middle' />
          <List.Content>
            <List.Header>{comment}</List.Header>
            <List.Description>Anonymous User</List.Description>
          </List.Content>
        </List.Item>)}
    </List>
  </>)
}

export default BlogComments