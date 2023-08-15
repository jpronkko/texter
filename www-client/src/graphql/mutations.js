import { gql } from '@apollo/client'

export const CREATE_USER = gql`
mutation createUser(
  $user: UserInput
  ) {
  createUser(
    user: $user
  ) { id }
}
`

export const CREATE_GROUP = gql`
mutation createGroup($name: String) {
  createGroup(
    name: $name
  ) { id }
}
`

export const CREATE_MESSAGE = gql`
mutation createMessage($message: MessageInput) {
  createMessage(
    message: $message
  ) { id }
}
`


export const LOGIN = gql`
mutation login(
  $credentials: UserLoginInput
) {
  login(
    credentials: $credentials
  ) { 
    token, 
    user {
      email
      id
      joinedGroups {
        id
        name
      }
      name
      ownedGroups {
        id
        name
      }
      username
    }
  } 
}
`
