
const express = require('express')
const cors = require('cors')
const http = require('http')
const { expressMiddleware } = require('@apollo/server/express4')

const config = require('./utils/config')
const { mongoConnect } = require('./services/mongo')
const { startApolloServer } = require('./services/apollo')
const logger = require('./utils/logger')

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  await mongoConnect()
  const apolloServer = await startApolloServer(httpServer)

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(apolloServer)
  )

  httpServer.listen(config.PORT, () =>
    logger.info(`Server is now running on http://localhost:${config.PORT}`)
  )
}

startServer()