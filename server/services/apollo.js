const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')

const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const typesArray = loadFilesSync('**/*', {
  extensions: ['graphql']
})

const resolversArray = loadFilesSync('**/*', {
  extensions: ['resolvers.js']
})

const startApolloServer = async (httpServer) => {
  const server = new ApolloServer({
    schema: makeExecutableSchema({ 
      typeDefs: typesArray, 
      resolvers: resolversArray 
    }),
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  })

  await server.start()
  return server
}

module.exports = {
  startApolloServer
}