const { authenticated } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')
const router = require('express').Router()


router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user')
  response.json(blogs)
})

router.post('/', authenticated, async ({ body, user }, response) => {
  const blog = new Blog({ ...body, user })
  const savedBlog = await blog.save()
  await User.findByIdAndUpdate(user.id, { blogs: [...user.blogs, savedBlog ] })
  response.status(201).json(savedBlog)
})

router.delete('/:id', authenticated, async (request, response) => {
  const blog = await Blog.findOne({ id: request.params.id, user: request.user.id })
  if (!blog)
    return response.status(401).json({ error: 'unauthorized operation' })
  await Blog.findByIdAndRemove(request.params.id)
  response.sendStatus(204)
})

router.patch('/:id', async (request, response) => {
  const { likes } = request.body
  const result = await Blog.findByIdAndUpdate(request.params.id, { likes }, { new: true, runValidators: false })
    .populate('user')
  if (!result) throw { name: 'NotFoundError' }
  response.json(result)
})

router.post('/:id/comments', async (request, response) => {
  const { comment } = request.body
  const result = await Blog.findByIdAndUpdate(request.params.id, { $push: { comments: comment } }, { new: true, runValidators: false })
    .populate('user')
  if (!result) throw { name: 'NotFoundError' }
  response.json(result)
})

module.exports = router
