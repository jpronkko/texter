const url = 'http://localhost:4000'
const resetUrl = 'http://localhost:4000/test/reset'
const createUsersUrl = 'http://localhost:4000/test/addusers'

const request = require('supertest')

const endpoint = ''

const testUser = {
  name: 'testi_name',
  username: 'testi',
  email: 'testi@testi.com',
  password: 'testpassword',
}

const testUser2 = {
  name: 'testi2_name',
  username: 'testi2',
  email: 'testi2@testi.com',
  password: 'testpassword2',
}

const commonHeaders = {
  'Content-Type': 'application/json',
}

const postToServer = async (url, command, token) => {
  const authHeader = { Authorization: `bearer ${token}` }
  let headers = token ? { ...commonHeaders, ...authHeader } : commonHeaders

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
  const mutation = `mutation CreateUser { createUser(user: 
      { name: "${name}", 
        username: "${username}", 
        email: "${email}", 
        password: "${password}" 
      }){ 
        token
        userId
        username
        email
        name
        }
       }`
  const result = await gqlToServer(url, mutation)
  console.log('Create user result', result.body)
  return result.body?.data?.createUser
}

const createTestUser = async () => {
  return await createUser(
    testUser.name,
    testUser.username,
    testUser.email,
    testUser.password
  )
}

const createGroup = async (groupName, token) => {
  console.log('Create group', groupName, 'token', token)
  const mutation = `mutation CreateGroup { 
    createGroup(name: "${groupName}") {
      id
      name
    } 
  }`
  const result = await gqlToServer(url, mutation, token)
  console.log('result from create group: ', result.body)
  console.log('GroupName', groupName)

  return result.body?.data?.createGroup
}

const login = async (username, password) => {
  const mutation = `mutation Login { login(credentials: { 
      username: "${username}",
      password: "${password}" 
    }) { 
      token
      userId
      username
      name
      email
    }
  }`

  const result = await gqlToServer(url, mutation)
  console.log(result.body)
  return result.body?.data?.login
}

const loginTestUser = async () => {
  return await login(testUser.username, testUser.password)
}

const addUserToGroup = async (userId, groupId, token) => {
  const mutation = `mutation AddUserToGroup {
    addUserToGroup(groupId: "${groupId}", userId: "${userId}") {
      user
      group 
      role
    }
  }`

  const result = await gqlToServer(url, mutation, token)
  console.log(result.body)
  return result.body?.data?.addUserToGroup
}

const createInvitation = async (groupId, fromUserId, toUser, token) => {
  const mutation = `mutation CreateInvitation { 
      createInvitation(invitation: {
        groupId: "${groupId}"
        fromUserId: "${fromUserId}"
        toUser: "${toUser}"
      }){
        id
        groupId
        fromUserId
        toUser
        status
        sentTime
      } 
    }`

  const result = await gqlToServer(url, mutation, token)
  return result.body?.data?.createInvitation
}

const createTopic = async (groupId, name, token) => {
  const mutation = `mutation CreateTopic { 
    createTopic(
      groupId: "${groupId}"
      name: "${name}"
    ){
      id
      groupId
      name
    } 
  }`

  const result = await gqlToServer(url, mutation, token)
  return result.body?.data?.createTopic
}

const getUser = async (username) => {
  const query = `query FindUser {
    findUser(username: "${username}") {
      id
      name
      username
      groups {
        group {
          id
          name
        }
        role
      }
    }
  }`

  const result = await gqlToServer(url, query)
  return result.body.data.findUser
}

const getMessages = async (topicId, token) => {
  const query = `query GetMessages {
    getMessages(topicId: ${topicId}) {
      id
      topicId
      body
    }
  }`

  const result = await gqlToServer(url, query, token)
  return result.body?.data?.createInvitation
}

const createMessage = async (topicId, body, token) => {
  const mutation = `mutation CreateMessage { 
    createMessage(messageInput: {
      topicId: "${topicId}"
      body: "${body}"
    }){
      id
      topicId
      fromUser {
        id
        name
      }
      body
    } 
  }`

  const result = await gqlToServer(url, mutation, token)
  console.log(result.body)
  return result.body?.data?.createMessage
}

module.exports = {
  url,
  testUser,
  testUser2,
  postToServer,
  gqlToServer,
  resetDatabases,
  createTestUser,
  createTestUsers,
  createUser,
  createGroup,
  getUser,
  login,
  loginTestUser,
  addUserToGroup,
  createInvitation,
  createTopic,
  getMessages,
  createMessage,
}
