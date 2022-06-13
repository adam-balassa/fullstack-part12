import React from 'react'
import { useSelector } from 'react-redux'
import Blogs from './Blogs'
import CreateBlog from './CreateBlog'
import Togglable from './Togglable'
import { Icon, Header } from 'semantic-ui-react'

const Main = () => {
  const blogs = useSelector(({ blogs }) => blogs.sort((a, b) => b.likes - a.likes))

  return <>
    <Header as='h1' icon textAlign='center'>
      <Icon name='write' circular />
      <Header.Content>Blogs</Header.Content>
    </Header>
    <Togglable buttonLabel="Create a blog">
      <CreateBlog />
    </Togglable>
    <div style={{ padding: '1rem 0' }}></div>
    <Blogs blogs={blogs} />
  </>
}

export default Main