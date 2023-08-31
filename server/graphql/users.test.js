//const request = require('supertest')
const { startServer, stopServer } = require('../server')
const testUsers = require('../utils/testUsers')
const {
  url,
  gqlToServer,
  createUser,
  createTestUser,
  createTestUsers,
  login,
  loginTestUser,
  resetDatabases,
  testUser
} = require('../utils/testHelpers')

const allUsers = 'query AllUsers { allUsers { name, username, email }}'

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

    expect(userData).toBeDefined()
    expect(userData.user.username).toEqual(testUser.username)
    expect(userData.user.name).toEqual(testUser.name)
  })

  it('create user with duplicate username does not work', async () => {
    await createTestUser()

    const response = await createUser(
      testUser.name + '2',
      testUser.username ,
      '2' + testUser.email,
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('create user with duplicate e-mail does not work', async () => {
    await createTestUser()

    const response = await createUser(
      testUser.name + '2',
      testUser.username + '2',
      testUser.email,
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('create user with incorrect e-mail does not work', async () => {
    const response = await createUser(
      testUser.name,
      testUser.username,
      'popppooo',
      testUser.password
    )
    expect(response).toBeNull()
  })

  it('creation of multiple test users works', async () => {
    await createTestUsers()

    const response = await gqlToServer(url, allUsers)
    const returnedUsers = response.body.data.allUsers
    const expectedUsers = testUsers.map(u => ({ username: u.username, name: u.name, email: u.email }))

    expect(expectedUsers).toEqual(expect.arrayContaining(returnedUsers))
  })

  it('login with correct credentials works', async () => {
    await createTestUser()

    const loginResponse = await loginTestUser()
    expect(loginResponse).toBeDefined()
    expect(loginResponse.token).toBeDefined()
    expect(loginResponse.user).toBeDefined()
  })

  it('login with incorrect password does not work', async () => {
    await createTestUser()

    const loginData = await login(testUser.username, 'kukkuluuruu')
    expect(loginData).toBeNull()
  })

  it('login with non existent account does not work', async () => {
    const loginData = await login(
      testUser.username,
      testUser.password
    )
    expect(loginData).toBeNull()
  })
})