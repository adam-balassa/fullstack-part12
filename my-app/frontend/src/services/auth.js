import axios from 'axios'
const baseUrl = '/api/auth'

const login = async ({ userName, password }) => {
  const response = await axios.post(`${baseUrl}/login`, { userName, password })
  return response.data
}

const getAllUsers = async () => {
  const response = await axios.get(`${baseUrl}/users`)
  return response.data
}

export default { login, getAllUsers }