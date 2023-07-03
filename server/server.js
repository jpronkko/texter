
const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const morganBody = require('morgan-body')
const { expressMiddleware } = require('@apollo/server/express4')
//const morgan = require('morgan')

const config = require('./utils/config')
const { mongoConnect, mongoDisconnect } = require('./services/mongo')
const { startApolloServer } = require('./services/apollo')
const logger = require('./utils/logger')
const healthCheckRouter = require('./routes/healthCheckRouter')

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  await mongoConnect()
  const apolloServer = await startApolloServer(httpServer)

  app.use(cors())
  //app.use(morgan('combined'))
  app.use(bodyParser.json())
  morganBody(app)
  app.use('/health', healthCheckRouter)

  if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    logger.info('Adding test routes.')
    const testRouter = require('./routes/testRouter')
    app.use('/test', testRouter)
  }

  app.use(
    '/',
    cors(),
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