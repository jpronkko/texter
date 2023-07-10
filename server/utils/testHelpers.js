const url = 'http://localhost:4000'
const resetUrl = 'http://localhost:4000/test/reset'
const createUsersUrl  = 'http://localhost:4000/test/addusers'

const request = require('supertest')
const test_user = {
  name: 'testi_name',
  username: 'testi',
  email: 'testi@testi.com',
  password: 'testpassword',
}

const resetDatabases = async () => {
  // Empty users from the test db
  await request(resetUrl).post('/').send({})
}

const createTestUsers = async () => {
  const response = await request(createUsersUrl).post('/').send({})
  return response
}

const createUser = async (name, username, email, password) => {
  const mutationString =
  `mutation: 'mutation CreateUser { createUser(user: { name: ${name}, email: ${email}, username: ${username}, password: ${password} }){ id }}`

  const response = await request(url).post('/').send(mutationString)
  return response
}

const createTestUser = async () => {
  return await createUser(
    test_user.name,
    test_user.username,
    test_user.email,
    test_user.password
  )
}

const createGroup = async (groupName, userId) => {
  const mutationString = {
    mutation: `mutate CreateGroup { createGroup(${groupName}, ${userId}) }`
  }

  const response = await request(url).post('/').send(mutationString)
  return response
}

const login = async (username, password) => {
  const mutationString =
  'mutation Login { login(credentials: { username: ' +
      username + ', password: ' + password +'} ) { token }}'

  const response = await request(url).post('/').send(mutationString)
  return response
}

const loginTestUser = async () => {
  return await login(test_user.username, test_user.password)
}

module.exports = {
  url,
  createTestUser,
  createTestUsers,
  createGroup,
  login,
  loginTestUser,
  resetDatabases,
  test_user,
}