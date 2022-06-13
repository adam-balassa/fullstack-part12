import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => token = `Bearer ${newToken}`

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async blog => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const like = async (blogId, likes) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.patch(`${baseUrl}/${blogId}`, { likes }, config)
  return response.data
}

const comment = async (blogId, comment) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, { comment }, config)
  return response.data
}

const remove = async blogId => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${blogId}`, config)
  return response.data
}

export default { getAll, create, like, comment, remove, setToken }