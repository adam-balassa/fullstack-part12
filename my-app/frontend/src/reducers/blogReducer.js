import service from '../services/blogs'
import { notify } from './notificationReducer'
import { addBlogToUser, deleteBlogFromUser } from './usersReducer'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'CREATE_BLOG':
    return [ ...state, action.data]
  case 'UPDATE_BLOG':
    return state.map(blog => action.newBlog.id === blog.id ? action.newBlog : blog)
  case 'DELETE_BLOG':
    return state.filter(blog => action.id !== blog.id)
  case 'INIT_BLOGS':
    return action.data
  default: return state
  }
}

export const createBlog = blog => {
  return async dispatch => {
    try {
      const data = await service.create(blog)
      dispatch({ type: 'CREATE_BLOG', data })
      dispatch(notify(`You created ${data.title}`))
      dispatch(addBlogToUser(data.user.id, data))
    } catch (e) {
      dispatch(notify(e.response && e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const likeBlog = blog => {
  return async dispatch => {
    try {
      const newBlog = await service.like(blog.id, blog.likes + 1)
      dispatch({ type: 'UPDATE_BLOG', newBlog })
      dispatch(notify(`You liked ${newBlog.title}`))
    } catch (e) {
      dispatch(notify(e.response && e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const addComment = (comment, blog) => {
  return async dispatch => {
    try {
      const newBlog = await service.comment(blog.id, comment)
      dispatch({ type: 'UPDATE_BLOG', newBlog })
      dispatch(notify(`You commented "${comment}" on "${newBlog.title}"`))
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const deleteBlog = blog => {
  return async dispatch => {
    try {
      await service.remove(blog.id)
      dispatch({ type: 'DELETE_BLOG', id: blog.id })
      dispatch(notify(`You deleted ${blog.title}`))
      dispatch(deleteBlogFromUser(blog.user.id, blog.id))
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export const initBlogs = () => {
  return async dispatch => {
    try {
      const data = await service.getAll()
      dispatch(({ type: 'INIT_BLOGS', data }))
    } catch (e) {
      dispatch(notify(e.response.data.error || e.message || 'An error occured', true, 4))
    }
  }
}

export default reducer