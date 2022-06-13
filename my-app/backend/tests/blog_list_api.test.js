const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)

beforeEach(async () => {
  await helper.emptyDB()
  await helper.initDB()
})

describe('list blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  })

  test('all blogs have proper id', async () => {
    const response = await api.get('/api/blogs')

    response.body.forEach(blog => {
      expect(blog.id).toBeDefined()
    })
  })

  test('all users and comments are populated into blogs', async () => {
    const response = await api.get('/api/blogs')

    const { userName, name } = helper.initialUsers[0]
    response.body.forEach(blog => {
      expect(blog.user).toBeDefined()
      expect(blog.user).toMatchObject({ userName, name })
      expect(blog.comments).toBeDefined()
      expect(blog.comments).toHaveLength(2)
    })
  })
})

describe('post a blog', () => {
  const newBlog = {
    title: 'new title',
    author: 'new author',
    url: 'http://test.com/new',
    likes: 10
  }

  test('new blog is returned as json', async () => {
    const token = await helper.tokenForAuthorizedUser()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })
      .expect(201)
      .expect('Content-Type', /application\/json/)
  })

  test('number of blogs increased', async () => {
    const token = await helper.tokenForAuthorizedUser()
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })

    expect(await helper.blogsInDb()).toHaveLength(helper.initialBlogs.length + 1)
  })

  test('proper blog is uploaded', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })

    const { userName, name } = helper.initialUsers[0]
    expect(response.body).toMatchObject({
      id: expect.any(String),
      title: 'new title',
      author: 'new author',
      url: 'http://test.com/new',
      likes: 10,
      user: { userName, name },
      comments: []
    })
  })

  test('creator of the blog is the authenticated user', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const { body } = await api
      .post('/api/blogs')
      .send(newBlog)
      .set({ Authorization: token })

    const uploadedBlog = await Blog.findById(body.id)
    const user = await helper.userInDb().populate('blogs')

    expect(String(uploadedBlog.user)).toBe(user.id)
    expect(user.blogs).toContainEqual(expect.objectContaining(newBlog))
  })

  test('like property is 0 by default', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const { title, author, url } = newBlog
    const response = await api
      .post('/api/blogs')
      .send({ title, author, url })
      .set({ Authorization: token })

    expect(response.body).toMatchObject({
      likes: 0
    })
  })

  test('if title missing it returns Bad Request', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const { author, url, likes } = newBlog
    await api
      .post('/api/blogs')
      .send({ author, url, likes })
      .expect(400)
      .set({ Authorization: token })
  })

  test('rejects unauthorized access', async () => {
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('delete a blog', () => {
  test('number of blogs decreases', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const blogId = await helper.blogId()
    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: token })
      .expect(204)

    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb).toHaveLength(helper.initialBlogs.length - 1)
  })

  test('deleted id is not in db', async () => {
    const token = await helper.tokenForAuthorizedUser()
    const blogId = await helper.blogId()
    await api
      .delete(`/api/blogs/${blogId}`)
      .set({ Authorization: token })
      .expect(204)

    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb.map(blog => blog.toJSON())).not.toContainEqual(expect.objectContaining({ id: blogId }))
  })

  test('rejects unauthorized access', async () => {
    const blogId = await helper.blogId()
    await api
      .delete(`/api/blogs/${blogId}`)
      .expect(401)
  })
})

describe('update blog likes', () => {
  test('blog\'s id is updated', async () => {
    const blogId = await helper.blogId()
    await api
      .patch(`/api/blogs/${blogId}`)
      .send({ likes: 123 })

    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb.map(blog => blog.toJSON())).toContainEqual(expect.objectContaining({ id: blogId, likes: 123 }))
  })

  test('updated blog is returned', async () => {
    const blogId = await helper.blogId()
    const response = await api
      .patch(`/api/blogs/${blogId}`)
      .send({ likes: 123 })

    expect(response.body).toMatchObject({ id: blogId, likes: 123 })
  })

  test('returns 404 for invalid blog id', async () => {
    const blogId = await helper.blogId()
    await api.delete(`/api/blogs/${blogId}`).set({ Authorization: await helper.tokenForAuthorizedUser() })

    await api
      .patch(`/api/blogs/${blogId}`)
      .send({ likes: 123 })
      .expect(404)
  })
})

describe('comment on a blog', () => {
  test('comment is added to comments', async () => {
    const blogId = await helper.blogId()
    await api
      .post(`/api/blogs/${blogId}/comments`)
      .send({ comment: 'New comment' })

    const blogsInDb = await helper.blogsInDb()
    expect(blogsInDb.map(blog => blog.toJSON())).toContainEqual(expect.objectContaining({ id: blogId, comments: expect.arrayContaining(['New comment']) }))
  })

  test('updated blog is returned', async () => {
    const blogId = await helper.blogId()
    const response = await api
      .post(`/api/blogs/${blogId}/comments`)
      .send({ comment: 'New comment' })

    expect(response.body).toMatchObject({ id: blogId, comments: expect.arrayContaining(['New comment']) })
  })

  test('returns 404 for invalid blog id', async () => {
    const blogId = await helper.blogId()
    await api.delete(`/api/blogs/${blogId}`).set({ Authorization: await helper.tokenForAuthorizedUser() })

    await api
      .post(`/api/blogs/${blogId}/comments`)
      .send({ comment: 'New comment' })
      .expect(404)
  })
})

afterAll(async () => {
  await helper.emptyDB()
  mongoose.connection.close()
})