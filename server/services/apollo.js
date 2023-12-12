const { ApolloServer } = require('@apollo/server')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')

const typesArray = loadFilesSync('**/*', {
  extensions: ['graphql'],
})

const resolversArray = loadFilesSync('**/*', {
  extensions: ['resolvers.js'],
})

const startApolloServer = async (httpServer) => {
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({
    typeDefs: typesArray,
    resolvers: resolversArray,
  })

  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()
  return server
}

module.exports = {
  startApolloServer,
}
