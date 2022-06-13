const User = require('../models/user')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const initialUsers = [
  {
    userName: 'userName1',
    name: 'Basic User',
    password: 'password123'
  },
  {
    userName: 'userName2',
    name: 'Basic User 2',
    password: 'password123'
  }
]

const initialBlogs = [
  {
    title: 'test title',
    author: 'test author',
    url: 'http://test.com',
    likes: 4,
    comments: [
      'test comment 1',
      'test comment 2',
    ]
  },
  {
    title: 'test title 2',
    author: 'test author 2',
    url: 'http://test.com/2',
    likes: 2,
    comments: [
      'test comment 3',
      'test comment 4',
    ]
  }
]

const blogsInDb = () => Blog.find({})

const blogId = () => Blog.find({}).then(blogs => blogs[0].id)

const usersInDb = () => User.find({})

const userInDb = () => User.findOne({ userName: initialUsers[0].userName })

const tokenForAuthorizedUser = async () => {
  const { userName, _id } = await userInDb()
  const token = await jwt.sign({ userName, id: _id }, process.env.SECRET, { expiresIn: 60*60 })
  return `Bearer ${ token }`
}

const emptyDB = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})
}

const initDB = async () => {
  await Promise.all(initialUsers.map(async ({ userName, name, password }) =>
    new User({ userName, name, passwordHash: await bcrypt.hash(password, 10) }).save()
  ))
  const user = await userInDb()
  const blogs = initialBlogs.map(note => new Blog({ ...note, user }))
  await Promise.all(blogs.map(blog => blog.save()))
  await User.findByIdAndUpdate(user.id, { blogs })
}

module.exports = { initialUsers, initialBlogs, emptyDB, initDB, blogsInDb, blogId, usersInDb, tokenForAuthorizedUser, userInDb }