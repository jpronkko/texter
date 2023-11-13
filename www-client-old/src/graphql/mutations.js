import { gql } from '@apollo/client'

export const CREATE_USER = gql`
mutation createUser($user: UserInput) {
  createUser(user: $user) { 
    token
    user {
      email
      id
    }
  }
}
`

export const CREATE_GROUP = gql`
mutation createGroup($name: String!) {
  createGroup(name: $name) { id, name }
}
`

export const CREATE_MESSAGE = gql`
mutation createMessage($messageInput: MessageInput) {
  createMessage(messageInput: $messageInput) { id, fromUser, sentTime }
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