const request = require('supertest')
const { startServer } = require('../server')

const queryAllUsers = {
  query: 'query foo { allUsers { name }}'
}

describe('user test', () => {
  const url = 'http://localhost:4000'
  let httpServer, apolloServer

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await httpServer?.close()
    await apolloServer?.stop()
  })

  it('has users', async () => {
    const response = await request(url).post('/').send(queryAllUsers)
    expect(response.errors).toBeUndefined()
    console.debug(response.body)
    expect(response.body.data?.allUsers).toContain('mare')
  })
})