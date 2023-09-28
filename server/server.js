
const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
//const morganBody = require('morgan-body')
const { expressMiddleware } = require('@apollo/server/express4')
//const morgan = require('morgan')
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

  mongoConnect()
  const apolloServer = await startApolloServer(httpServer)

  app.use(cors())
  //app.use(morgan('combined'))
  app.use(bodyParser.json())
  //morganBody(app)
  app.use('/health', healthCheckRouter)

  if(process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
    logger.info('Adding test routes.')
    const testRouter = require('./routes/testRouter')
    app.use('/test', testRouter)
  }

  app.use(
    '/',
    express.json(),
    expressMiddleware(apolloServer, {
      context: async({ req,  }) => {
        /*
        const anniId = '64ec7c31d770cca4eb314561'
        const currentUser = await usersModel.findUserWithId(anniId)
        return { currentUser }
        */

        const auth = req ? req.headers.authorization : null
        if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
          try {
            const decodedToken = jwt.verify(
              auth.substring(7), config.JWT_SECRET
            )
            console.log('decooded', decodedToken)
            const currentUser = await usersModel.findUserWithId(decodedToken.id)
            return { currentUser }
          } catch (error) {
            logger.error('Token decode failed', error)
          }
          return null
        }
      }
    }),
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

module.exports = { startServer, stopServer }