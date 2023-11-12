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

export const GET_USER_BASE_DATA = gql`
  query GetUserBaseData($id: ID!) {
    getUserBaseData(id: $id) {
      id
      name
      username
    }
  }
`

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      email
      id
      name
      username
      joinedGroups {
        groupId
        groupName
        role
      }
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
      userId
      joinedGroups {
        groupId
        groupName
        role
      }
    }
  }
`

export const GET_TOPICS = gql`
  query GetTopics($groupId: ID!) {
    getTopics(groupId: $groupId) {
      id
      groupId
      name
    }
  }
`

export const GET_MESSAGES = gql`
  query GetMessages($topicId: ID!) {
    getMessages(topicId: $topicId) {
      id
      topicId
      body
      sentTime
      fromUser {
        id
        name
      }
    }
  }
`

export const GET_SENT_INVITATIONS = gql`
  query GetSentInvitations {
    getSentInvitations {
      id
      sentTime
      status
      user {
        id
        name
        username
      }
      group {
        id
        name
        ownerId
      }
    }
  }
`

export const GET_RECV_INVITATIONS = gql`
  query GetReceivedInvitations {
    getReceivedInvitations {
      user {
        id
        name
        username
      }
      status
      sentTime
      id
      group {
        id
        name
        ownerId
      }
    }
  }
`
