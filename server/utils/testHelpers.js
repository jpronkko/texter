const url = 'http://localhost:4000'
const resetUrl = 'http://localhost:4000/test/reset'
const createUsersUrl  = 'http://localhost:4000/test/addusers'

const request = require('supertest')

const endpoint = ''

const test_user = {
  name: 'testi_name',
  username: 'testi',
  email: 'testi@testi.com',
  password: 'testpassword',
}

const commonHeaders = {
  'Content-Type': 'application/json'
}

const postToServer = async (url, command, token) => {
  const authHeader = { 'Authorization': `bearer ${token}` }
  let headers = token ? { ...commonHeaders, ...authHeader } :
    commonHeaders
  console.log('Posting to server with headers:', headers)
  const response = await request(url)
    .post(endpoint)
    .set(headers)
    .send(command ? command : {})
  return response
}

const gqlToServer = async (url, query, token) => {
  return await postToServer(url, { query }, token)
}

const resetDatabases = async () => {
  // Empty users from the test db
  return await postToServer(resetUrl, endpoint)
}

const createTestUsers = async () => {
  return await postToServer(createUsersUrl)
}

const createUser = async (name, username, email, password) => {
  const mutation =
    `mutation CreateUser { createUser(user: 
      { name: "${name}", email: "${email}", 
        username: "${username}", password: "${password}" 
      }){ 
        token
        user {
          id
          name
          username
        }
       }}`
  const result = await gqlToServer(url, mutation)
  return result.body?.data?.createUser
}

const createTestUser = async () => {
  return await createUser(
    test_user.name,
    test_user.username,
    test_user.email,
    test_user.password
  )
}

const createGroup = async (groupName, token) => {
  const mutation =
    `mutation CreateGroup { 
      createGroup(name: "${groupName}") {
        id
        name
      } }`
  const result = await gqlToServer(url, mutation, token)
  console.log(result.body)
  return result.body?.data?.createGroup
}

const login = async (username, password) => {
  const mutation =
    `mutation Login { login(credentials: { 
      username: "${username}",
      password: "${password}" 
    }) { 
      token
      user {
        id
        username
        ownedGroups {
          id
          name
        }
        joinedGroups {
          id
          name
        }
      }
    }}`

  const result = await gqlToServer(url, mutation)
  return result.body?.data?.login
}

const loginTestUser = async () => {
  return await login(test_user.username, test_user.password)
}

module.exports = {
  url,
  postToServer,
  gqlToServer,
  createTestUser,
  createTestUsers,
  createGroup,
  login,
  loginTestUser,
  resetDatabases,
  test_user,
}