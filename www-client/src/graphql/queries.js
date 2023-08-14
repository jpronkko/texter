import { gql } from '@apollo/client'

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

export const GET_USERS_GROUPS = gql`
query GetUserGroupInfo {
  getUserGroupInfo {
    id
    name
  }
}
`