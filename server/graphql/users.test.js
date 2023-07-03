const request = require('supertest')
const { startServer, stopServer } = require('../server')

const queryAllUsers = {
  query: 'query foo { allUsers { name }}'
}

const createUser = {
  mutation: 'mutation foo { createUser(user: { name: foo, email: huppa@jeep, username: rocketman, password: puupaa } ) { id }}'
}

describe('user test', () => {
  const url = 'http://localhost:4000'
  let httpServer, apolloServer

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  it('create user', async () => {
    const response = await request(url).post('/').send(createUser)
    expect(response.errors).toBeUndefined()
    console.debug(response.body)
    expect(response.body.data?.allUsers).toContain('mare')
  })

  it('has users', async () => {
    const response = await request(url).post('/').send(queryAllUsers)
    expect(response.errors).toBeUndefined()
    console.debug(response.body)
    expect(response.body.data?.allUsers).toContain('mare')
  })
})