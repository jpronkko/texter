import { gql } from '@apollo/client'

export const CREATE_USER = gql`
  mutation createUser($user: UserInput) {
    createUser(user: $user) {
      token
      user {
        id
        email
        name
        username
      }
    }
  }
`

export const CREATE_GROUP = gql`
  mutation createGroup($name: String!) {
    createGroup(name: $name) {
      id
      name
    }
  }
`

// createTopic(groupId: ID!, name: String!): T
export const CREATE_TOPIC = gql`
  mutation createTopic($groupId: ID!, $name: String!) {
    createTopic(groupId: $groupId, name: $name) {
      id
      name
    }
  }
`

export const CREATE_MESSAGE = gql`
  mutation createMessage($messageInput: MessageInput) {
    createMessage(messageInput: $messageInput) {
      id
      fromUser
      sentTime
    }
  }
`

export const LOGIN = gql`
  mutation login($credentials: UserLoginInput) {
    login(credentials: $credentials) {
      token
      user {
        id
        username
        email
        name
        groups {
          role
          group {
            id
            name
          }
        }
      }
    }
  }
`
