/* eslint-disable no-undef */
db.createUser({
  user: 'blog_user',
  pwd: 'blog_pass',
  roles: [
    {
      role: 'dbOwner',
      db: 'blogs',
    },
  ],
})

db.createCollection('blogs')

db.blogs.insert({ title: 'First blog', url: 'http://example.com', author: 'Adam Balassa' })