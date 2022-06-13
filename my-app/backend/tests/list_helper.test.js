const listHelper = require('../utils/list_helper')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of a bigger list is calculated right', () => {
    const likes = [3, 1, 2, 4]
    const result = listHelper.totalLikes(likes.map(like => ({ ...(listWithOneBlog[0]), likes: like })))
    expect(result).toBe(10)
  })
})

describe('favourite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when list has only one blog returns that blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('of a bigger list is calculated right', () => {
    const likes = [3, 1, 2, 4]
    const result = listHelper.favoriteBlog(likes.map(like => ({ ...(listWithOneBlog[0]), likes: like })))
    expect(result.likes).toBe(4)
  })
})

describe('most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, it returns its author', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 1 })
  })

  test('of a bigger list returns the correct author', () => {
    const authors = ['Edsger W. Dijkstra', 'Adam Balassa', 'Edsger W. Dijkstra', 'Edsger W. Dijkstra', 'Adam Balassa']
    const result = listHelper.mostBlogs(authors.map(author => ({ ...(listWithOneBlog[0]), author })))
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 3 })
  })
})

describe('most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, it returns its author', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 5 })
  })

  test('of a bigger list returns the correct author', () => {
    const authors = [
      { author: 'Edsger W. Dijkstra', likes: 2 },
      { author: 'Edsger W. Dijkstra', likes: 3 },
      { author: 'Adam Balassa', likes: 5 },
      { author: 'Edsger W. Dijkstra', likes: 2 },
      { author: 'Adam Balassa', likes: 3 }]
    const result = listHelper.mostLikes(authors)
    expect(result).toEqual({ author: 'Adam Balassa', likes: 8 })
  })
})