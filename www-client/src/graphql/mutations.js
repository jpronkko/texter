import { gql } from '@apollo/client'

export const CREATE_USER = gql`
mutation createUser(
  $name: String!,
  $email: String!, 
  $username: String!, 
  $password: String!
  ) {
  createUser(
    name: $name, 
    email: $email
    username: $username,
    password: $password,
  ) { id }
}
`