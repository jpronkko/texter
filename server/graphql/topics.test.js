const { startServer, stopServer } = require('../server')

const {
  url,
  gqlToServer,
  createTestUser,
  createGroup,
  resetDatabases,
  createTopic,
} = require('../utils/testHelpers')


const testTopicName = 'testi'

describe('topic test', () => {
  let httpServer, apolloServer, userData, groupData

  beforeAll(async () => {
    ({ httpServer, apolloServer } = await startServer())
  })

  afterAll(async () => {
    await stopServer(httpServer, apolloServer)
  })

  beforeEach(async () => {
    // Empty the test db
    await resetDatabases()
    // Create test user for all the tests
    userData  = await createTestUser()

    groupData = await createGroup('test_group', userData.token)
  })

  it('creating a topic works with appropriate token', async () => {
    const topic = await createTopic(
      groupData.id,
      testTopicName,
      userData.token
    )

    expect(topic).toBeDefined()
    expect(topic.name).toEqual(testTopicName)

    const query =
      `query AllTopics {
        allTopics {
          id
          name
        }
      }`

    const result = await gqlToServer(url, query, userData.token)
    console.log(result.body)
    const topicInDb = result.body?.data?.allTopics[0]
    expect(topicInDb).toBeDefined()
    console.log(topicInDb)
  })

  /*it('creating a topic does not work with false token', async () => {
    const topic = await createTopic(
      groupData.id,
      testTopicName,
      'fidhljvfsjdfdhfjs',
    )

    expect(topic).toBeUndefined()
  })*/
})
