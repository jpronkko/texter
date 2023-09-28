import { gql } from '@apollo/client'

export const GET_MY_INFO = gql`
query GetMyInfo {
  me {
    id
    name
    username
    email
    groups {
      group {
        id
      name
      }
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

export const GET_USER_JOINED_GROUPS = gql`
query GetUserJoinedGroups {
  getUserJoinedGroups {
    group {
      id
      name
    }
  }
}
`

export const GET_TOPICS = gql`
query GetTopics($groupId: ID!) {
  getTopics(groupId: $groupId) {
    id
    name
  }
}`


export const GET_MESSAGES = gql`
query GetMessages($topicId: ID!) {
  getMessages(topicId: $topicId) {
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
