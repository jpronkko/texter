
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
export default {
  typeDefs,
  resolvers
}