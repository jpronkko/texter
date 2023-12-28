const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const { expressMiddleware } = require('@apollo/server/express4')
const jwt = require('jsonwebtoken')
const config = require('./utils/config')
const { mongoConnect, mongoDisconnect } = require('./services/mongo')
const { startApolloServer } = require('./services/apollo')
const logger = require('./utils/logger')
const healthCheckRouter = require('./routes/healthCheckRouter')

const usersModel = require('./models/users.model')

const startServer = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  await mongoConnect()
  const apolloServer = await startApolloServer(httpServer)

  app.use(cors())
  app.use(bodyParser.json())
  app.use('/health', healthCheckRouter)

  if (
    process.env.NODE_ENV === 'test' ||
    process.env.NODE_ENV === 'development'
  ) {
    logger.info('Adding test routes.')
    const testRouter = require('./routes/testRouter')
    app.use('/test', testRouter)
  }

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.NODE_ENV === 'test'
  ) {
    app.use(express.static('build'))
  }

  app.use(
    '/api',
    express.json(),
    expressMiddleware(apolloServer, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7),
              config.JWT_SECRET
            )

            const currentUser = await usersModel.findUserWithId(
              decodedToken.userId
            )
            return { currentUser }
          } catch (error) {
            logger.error(
              'Middleware: Token decode failed',
              error,
              'auth',
              auth.substring(7)
            )
          }
          return null
        }
      },
    })
  )

  httpServer.listen(config.PORT, () =>
    logger.info(
      `Server is now running on http://localhost:${config.PORT} and waiting for connections...`
    )
  )
  return { httpServer, apolloServer }
}

const stopServer = async (httpServer, apolloServer) => {
  mongoDisconnect()
  await httpServer.close()
  await apolloServer.stop()
}

module.exports = { startServer, stopServer }
