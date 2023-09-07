import { gql } from '@apollo/client'

export const GET_MY_INFO = gql`
query GetMyInfo {
  me {
    name
    username
    email
    ownedGroups {
      id
      name
    }
    joinedGroups {
      id
      name
    }
  }
}
`

export const GET_ALL_USERS = gql`
query GetAllUsers {
  allUsers {
    name
    username
  }
}
`

export const GET_ALL_GROUPS = gql`
query GetAllGroups {
  allGroups {
    id
    ownerId
    name
  }
}
`

export const GET_ALL_MESSAGES = gql`
query GetAllMessages {
  allMessages {
    id
    text
  }
}
`

export const GET_MESSAGES = gql`
query GetMessages($groupId: ID!) {
  getMessages(groupId: $groupId) {
    id
    body
    sentTime
    fromUser {
      id
      name
    }
  }
}
`

export const GET_USERS_GROUPS = gql`
query GetUserGroupInfo {
  getUserGroupInfo {
    id
    name
  }
}
`