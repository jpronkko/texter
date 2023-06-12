const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { mongoConnect } = require('./services/mongo')

let users = [
  { 
    id: "122345",
    name: "Mickey",
    username: "mickey",
  },
  {
    id: "122345",
    name: "Klcikey",
    username: "klickey",
  }
]

const typeDefs = `
type User {
  id: ID!
  name: String!
  username: String!
}

type Query {
  allUsers: [User!]!
  findUser(username: String!): User
}
`

const resolvers = {
  Query: {
    allUsers: () => users,
    findUser: (root, args) => 
      users.find(u => u.username === args.username)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const startServer = async () => {
  await mongoConnect()  
  startStandaloneServer(server, {
    listen: { port: 4000 },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

startServer()