//const request = require('supertest')
const { startServer, stopServer } = require('../server')
const testUsers = require('../utils/testUsers')
const {
  url,
  postToServer,
  createTestUser,
  createTestUsers,
  login,
  loginTestUser,
  resetDatabases,
  test_user
} = require('../utils/testHelpers')
//const { createUser } = require('../models/users.model')

const queryAllUsers = {
  query: 'query AllUsers { allUsers { name, username, email }}'
}

describe('user test', () => {
  let httpServer, apolloServer

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  beforeEach(async () => {
    // Empty users from the test db
    await resetDatabases()
  })

  it('create user works with appropriate input', async () => {
    const userData = await createTestUser()
    console.log('User data', userData)
    expect(userData).toBeDefined()
    expect(userData.user.username).toEqual(test_user.username)
    expect(userData.user.name).toEqual(test_user.name)
  })

  /*it('create user with incorrect e-mail does not work', async () => {
    const response = await createUser(
      test_user.name,
      test_user.username,
      'pop',
      test_user.password
    )
    expect(response.body.errors).toBeUndefined()
  })*/

  it('creation of test users works', async () => {
    const userData = await createTestUsers()
    expect(userData).toBeDefined()

    const response = await postToServer(url, queryAllUsers)
    expect(response.body.errors).toBeUndefined()

    const returnedUsers = response.body.data.allUsers
    const expectedUsers = testUsers.map(u => ({ username: u.username, name: u.name, email: u.email }))
    expect(expectedUsers).toEqual(expect.arrayContaining(returnedUsers))
  })

  it('login with correct credentials works', async () => {
    const userData = await createTestUser()
    expect(userData).toBeDefined()

    const loginResponse = await loginTestUser()
    expect(loginResponse).toBeDefined()
    expect(loginResponse.token).toBeDefined()
    expect(loginResponse.user).toBeDefined()
  })

  it('login with incorrect password does not work', async () => {
    const userData = await createTestUser()
    expect(userData).toBeDefined()

    const loginData = await login(test_user.username, 'kukkuluuruu')
    expect(loginData).toBeNull()
  })
})