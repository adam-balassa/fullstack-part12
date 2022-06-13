const _ = require('lodash')

const totalLikes = blogs =>
  blogs.reduce((acc, elem) => acc + elem.likes || 0, 0)

const favoriteBlog = blogs =>
  blogs.reduce((acc, elem) => !acc || elem.likes > acc.likes ? elem : acc, null)

const mostBlogs = blogList => {
  const [author, blogs] = _(blogList)
    .countBy('author')
    .toPairs()
    .maxBy(1)
  return { author, blogs }
}

const mostLikes = blogs => _(blogs)
  .groupBy('author')
  .toPairs()
  .map(([author, authorBlogs]) => ({ author, likes: _(authorBlogs).sumBy('likes') }))
  .maxBy('likes')


module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes }