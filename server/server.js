
const express = require('express')
const cors = require('cors')
const http = require('http')
const { expressMiddleware } = require('@apollo/server/express4')
const morgan = require('morgan')

const config = require('./utils/config')
const { mongoConnect, mongoDisconnect } = require('./services/mongo')
const { startApolloServer } = require('./services/apollo')
const logger = require('./utils/logger')
const healthCheckRouter = require('./routes/health_check')

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  await mongoConnect()
  const apolloServer = await startApolloServer(httpServer)

  app.use(cors())
  //app.use(morgan('combined'))
  app.use('/health', healthCheckRouter)

  if(process.env.NODE_ENV === 'test') {
    const testResetRouter = require('./routes/test_reset')
    app.use('/api/testing', testResetRouter)
  }

  app.use(
    '/',
    //cors(),
    express.json(),
    expressMiddleware(apolloServer),
  )

  httpServer.listen(config.PORT, () =>
    logger.info(`Server is now running on http://localhost:${config.PORT}`)
  )
  return { httpServer, apolloServer }
}

const stopServer = async (httpServer, apolloServer) => {
  mongoDisconnect()
  await httpServer.close()
  await apolloServer.stop()
}

startServer()

module.exports = { startServer, stopServer }