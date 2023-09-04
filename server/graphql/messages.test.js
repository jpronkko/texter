const { startServer, stopServer } = require('../server')
const { getMessages } = require('../models/topics.model')
const {
  url,
  gqlToServer,
  createTestUser,
  createGroup,
  resetDatabases,
  createTopic,
  createMessage,
} = require('../utils/testHelpers')

const testTopicName = 'testii'
const testMessage = 'It is a small step for a man, a giant leap for mankind'

describe('messages test', () => {
  let httpServer, apolloServer, userData, groupData, topicData

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
    topicData = await createTopic(groupData.id, testTopicName, userData.token)
  })

  it('create message with existing userId, existing topic', async () => {
    const message = await createMessage(
      topicData.id,
      testMessage,
      userData.token
    )

    expect(message).toBeDefined()
    expect(message.fromUser).toEqual(userData.user.id)
    expect(message.body).toEqual(testMessage)

    const messages = await getMessages(topicData.id)
    console.log('mesgs', messages)
    const messageInDb = messages[0]
    expect(messageInDb.id).toEqual(message.id)
    expect(messageInDb.fromUser.id).toEqual(userData.user.id)
    expect(messageInDb.body).toEqual(testMessage)
  })

  it('Creating message with garbage token does not work', async () => {
    const message = await createMessage(
      topicData.id,
      testMessage,
      'lfjfkjj'
    )

    expect(message).toBeUndefined()
  })

  it('Creating message with non existing topic does not work', async () => {
    const message = await createMessage(
      'dsadasf334',
      testMessage,
      userData.token
    )

    expect(message).toBeNull()
  })
})