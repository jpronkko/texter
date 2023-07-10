const request = require('supertest')
const { startServer, stopServer } = require('../server')
const testUsers = require('../utils/testUsers')
const {
  url,
  createTestUser,
  createTestUsers,
  login,
  loginTestUser,
  resetDatabases,
  test_user } = require('../utils/testHelpers')

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

  it('create user works', async () => {
    const response = await createTestUser()
    expect(response.body.errors).toBeUndefined()
    console.debug(response.body)
  })

  it('creation of test users works', async () => {
    const okresponse = await createTestUsers()
    expect(okresponse.body.errors).toBeUndefined()

    const response = await request(url).post('/').send(queryAllUsers)
    expect(response.body.errors).toBeUndefined()

    const returnedUsers = response.body.data.allUsers
    const expectedUsers = testUsers.map(u => ({ username: u.username, name: u.name, email: u.email }))
    expect(expectedUsers).toEqual(expect.arrayContaining(returnedUsers))
  })

  it('login with correct credentials works', async () => {
    const okresponse = await createTestUser()
    expect(okresponse.body.errors).toBeUndefined()

    const response = await loginTestUser()
    expect(response.body.errors).toBeUndefined()
  })

  it('login with incorrect password does not work', async () => {
    const okresponse = await createTestUser()
    expect(okresponse.body.errors).toBeUndefined()

    const response = await login(test_user.username, 'kukkuluuruu')
    console.debug('Responnsnsns', response.errors, response.body.errors)
    expect(response.body.errors).toBeDefined()
  })
})