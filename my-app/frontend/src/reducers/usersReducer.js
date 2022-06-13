import service from '../services/auth'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'INIT_USERS':
    return action.users
  case 'ADD_BLOG_TO_USER':
    return state.map(user =>
      user.id === action.userId
        ? { ...user, blogs: [...user.blogs, action.blog] }
        : user)
  case 'DELETE_BLOG_FROM_USER':
    return state.map(user =>
      user.id === action.userId
        ? { ...user, blogs: user.blogs.filter(blog => blog.id !== action.blogId) }
        : user)
  default: return state
  }
}

export const initUsers = () => {
  return async dispatch => {
    const users = await service.getAllUsers()
    dispatch(({ type: 'INIT_USERS', users }))
  }
}

export const addBlogToUser = (userId, blog) => {
  return async dispatch => {
    dispatch(({ type: 'ADD_BLOG_TO_USER', userId, blog }))
  }
}

export const deleteBlogFromUser = (userId, blogId) => {
  return async dispatch => {
    dispatch(({ type: 'DELETE_BLOG_FROM_USER', userId, blogId }))
  }
}

export default reducer