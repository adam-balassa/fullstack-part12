import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Form, Container, Grid, Segment } from 'semantic-ui-react'
import { createBlog } from '../reducers/blogReducer'
import { useField } from '../hooks'

const CreateBlog = ({ toggleVisibility }) => {
  const dispatch = useDispatch()
  const { reset: resetTitle, ...title } = useField('text')
  const { reset: resetAuthor, ...author } = useField('text')
  const { reset: resetUrl, ...url } = useField('text')
  const reset = () => [resetAuthor, resetUrl, resetTitle].forEach(fn => fn())

  const addBlog = async () => {
    const blog = { title: title.value, author: author.value, url: url.value }
    dispatch(createBlog(blog))
    reset()
  }

  return (
    <Container>
      <Segment>
        <Form onSubmit={e => { e.preventDefault(); addBlog() }}>
          <h2>Create blog</h2>
          <Form.Field>
            <label htmlFor="title">Title</label>
            <input value={title} id="title" {...title} />
          </Form.Field>
          <Form.Field>
            <label htmlFor="author">Author</label>
            <input value={author} id="author" {...author} />
          </Form.Field>
          <Form.Field>
            <label htmlFor="url">Url</label>
            <input value={url} id="url" {...url} />
          </Form.Field>
          <Grid>
            <Grid.Column>
              <Button.Group floated='right'>
                <Button onClick={toggleVisibility} type='button'>Cancel</Button>
                <Button.Or />
                <Button positive type='submit'>Create</Button>
              </Button.Group>
            </Grid.Column>
          </Grid>
        </Form>
      </Segment>
    </Container>
  )
}

export default CreateBlog