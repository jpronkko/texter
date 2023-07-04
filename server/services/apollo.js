const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const User = require('../models/users.mongo')

const typesArray = loadFilesSync('**/*', {
  extensions: ['graphql']
})

const resolversArray = loadFilesSync('**/*', {
  extensions: ['resolvers.js']
})

const startApolloServer = async (httpServer) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray
  })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const auth = req ? req.headers.authorization : null
      if (auth && auth.toLocaleLowerCase().startsWith('bearer ')) {
        const decodedToken = jwt.verify(
          auth.substring(7), config.JWT_SECRET
        )
        const currentUser = await User.findById(decodedToken.id)
        return { currentUser }
      }},
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            }
          }
        }
      }
    ],
  })

  await server.start()
  return server
}

module.exports = {
  startApolloServer,
}